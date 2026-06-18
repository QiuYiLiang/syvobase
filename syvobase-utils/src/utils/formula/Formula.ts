import { callMap } from './callMap'

export type TokenType =
  | 'operator'
  | 'function'
  | 'identifier'
  | 'paren'
  | 'comma'
  | 'string'
  | 'number'

export interface Token {
  type: TokenType
  value: string
}

export type ASTNode =
  | { type: 'identifier'; name: string }
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'binary'; op: string; left: ASTNode; right: ASTNode }
  | { type: 'unary'; op: string; arg: ASTNode }
  | { type: 'function'; name: string; args: ASTNode[] }

export class Formula {
  static operators = [
    '+',
    '-',
    '*',
    '/',
    '>',
    '<',
    '>=',
    '<=',
    '==',
    '!=',
    '(',
    ')',
    ',',
  ]
  static functionSet = new Set(Object.keys(callMap))

  static tokenize(input: string): Token[] {
    const tokens: Token[] = []
    let i = 0

    while (i < input.length) {
      const char = input[i]

      // 跳过空白
      if (/\s/.test(char)) {
        i++
        continue
      }

      // 识别 operator
      let matchedOp = ''
      for (const op of Formula.operators.sort((a, b) => b.length - a.length)) {
        if (input.startsWith(op, i)) {
          matchedOp = op
          break
        }
      }
      if (matchedOp) {
        tokens.push({
          type:
            matchedOp === '(' || matchedOp === ')'
              ? 'paren'
              : matchedOp === ','
                ? 'comma'
                : 'operator',
          value: matchedOp,
        })
        i += matchedOp.length
        continue
      }

      // 识别 #(xxx) 作为 identifier，返回括号内内容
      const hashIdMatch = /^#\(([^)]*)\)/.exec(input.slice(i))
      if (hashIdMatch) {
        tokens.push({ type: 'identifier', value: hashIdMatch[1] })
        i += hashIdMatch[0].length
        continue
      }

      // 识别函数名（仅在后面跟左括号时才识别为函数，否则都为字面量）
      const funcMatch = /^[A-Za-z_][A-Za-z0-9_]*/.exec(input.slice(i))
      if (
        funcMatch &&
        Formula.functionSet.has(funcMatch[0]) &&
        input[i + funcMatch[0].length] === '('
      ) {
        tokens.push({ type: 'function', value: funcMatch[0] })
        i += funcMatch[0].length
        continue
      }

      // 识别数字
      const numberMatch = /^\d+(\.\d+)?/.exec(input.slice(i))
      if (numberMatch) {
        tokens.push({ type: 'number', value: numberMatch[0] })
        i += numberMatch[0].length
        continue
      }
      // 识别字符串（支持单引号和双引号包裹）
      if (input[i] === '"' || input[i] === "'") {
        const quote = input[i]
        let str = ''
        i++
        while (i < input.length && input[i] !== quote) {
          str += input[i]
          i++
        }
        i++ // 跳过结束引号
        tokens.push({ type: 'string', value: str })
        continue
      }

      // 识别普通字符串（未被引号包裹的内容，作为 string）
      const strMatch = /^[^\s(),+\-*/><=]+/.exec(input.slice(i))
      if (strMatch) {
        tokens.push({ type: 'string', value: strMatch[0] })
        i += strMatch[0].length
        continue
      }
      // 如果没有收集到内容，跳过当前字符
      i++
    }

    return tokens
  }

  static parse(tokens: Token[]): ASTNode {
    let pos = 0

    function parsePrimary(): ASTNode {
      const token = tokens[pos]
      if (!token) throw new Error('Unexpected end')
      // 一元运算符处理（支持一元-和一元+）
      if (
        token.type === 'operator' &&
        (token.value === '-' || token.value === '+')
      ) {
        const op = token.value
        pos++
        const arg = parsePrimary()
        return { type: 'unary', op, arg }
      }
      // 优先处理函数调用（function 或 identifier + '('）
      if (
        token.type === 'function' ||
        (token.type === 'identifier' &&
          tokens[pos + 1]?.type === 'paren' &&
          tokens[pos + 1]?.value === '(')
      ) {
        const name = token.value
        pos++
        if (tokens[pos]?.type !== 'paren' || tokens[pos]?.value !== '(')
          throw new Error('Expected ( after function')
        pos++
        const args: ASTNode[] = []
        if (tokens[pos]?.type !== 'paren' || tokens[pos]?.value !== ')') {
          while (true) {
            args.push(parseExpr())
            if (tokens[pos]?.type === 'comma') {
              pos++
            } else {
              break
            }
          }
        }
        if (tokens[pos]?.type !== 'paren' || tokens[pos]?.value !== ')')
          throw new Error('Expected ) after function args')
        pos++
        return { type: 'function', name, args }
      }
      // 单独处理 identifier
      if (token.type === 'identifier') {
        pos++
        return { type: 'identifier', name: token.value }
      }
      // 处理 number
      if (token.type === 'number') {
        pos++
        return { type: 'number', value: Number(token.value) }
      }
      // 处理 string
      if (token.type === 'string') {
        pos++
        return { type: 'string', value: token.value }
      }
      if (token.type === 'paren' && token.value === '(') {
        pos++
        const node = parseExpr()
        if (tokens[pos]?.type !== 'paren' || tokens[pos]?.value !== ')')
          throw new Error('Expected )')
        pos++
        return node
      }
      throw new Error('Unexpected token: ' + JSON.stringify(token))
    }

    // 运算符优先级
    const PRECEDENCE: Record<string, number> = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
      '>': 0,
      '<': 0,
      '>=': 0,
      '<=': 0,
      '==': 0,
      '!=': 0,
    }

    function parseExpr(minPrec = 0): ASTNode {
      let left = parsePrimary()
      while (true) {
        const opToken = tokens[pos]
        if (
          !opToken ||
          opToken.type !== 'operator' ||
          PRECEDENCE[opToken.value] == null ||
          PRECEDENCE[opToken.value] < minPrec
        )
          break
        const op = opToken.value
        const prec = PRECEDENCE[op]
        pos++
        const right = parseExpr(prec + 1)
        left = { type: 'binary', op, left, right }
      }
      return left
    }

    const ast = parseExpr()
    if (pos < tokens.length) throw new Error('Unexpected token at end')
    return ast
  }

  static run(ast: ASTNode, getValue?: (id: string) => any): any {
    try {
      let value: any
      switch (ast.type) {
        case 'number':
          value = ast.value
          break
        case 'string':
          value = ast.value
          break
        case 'identifier':
          if (getValue) {
            value = getValue(ast.name)
          } else {
            throw new Error('Unknown identifier: ' + ast.name)
          }
          break
        case 'unary': {
          const v = Formula.run(ast.arg, getValue)
          switch (ast.op) {
            case '-':
              value = -v === 0 ? 0 : -v
              break
            case '+':
              value = +v
              break
            default:
              throw new Error('Unknown unary operator: ' + ast.op)
          }
          break
        }
        case 'binary': {
          const l = Formula.run(ast.left, getValue)
          const r = Formula.run(ast.right, getValue)
          switch (ast.op) {
            case '+':
              value = l + r
              break
            case '-':
              value = l - r
              break
            case '*':
              value = l * r
              break
            case '/':
              value = l / r
              break
            case '>':
              value = l > r
              break
            case '<':
              value = l < r
              break
            case '>=':
              value = l >= r
              break
            case '<=':
              value = l <= r
              break
            case '==':
              value = l == r
              break
            case '!=':
              value = l != r
              break
            default:
              throw new Error('Unknown operator: ' + ast.op)
          }
          break
        }
        case 'function': {
          const fn = callMap[ast.name]
          if (!fn) throw new Error('Unknown function: ' + ast.name)
          const args = ast.args.map((arg) => Formula.run(arg, getValue))
          value = fn(...args)
          break
        }
        default:
          throw new Error('Unknown AST node type: ' + (ast as any).type)
      }
      // 数字容错处理
      if (
        typeof value === 'number' &&
        (isNaN(value) || value === Infinity || value === -Infinity)
      ) {
        return ''
      }
      if (value instanceof Date && isNaN(value.getTime())) {
        return ''
      }
      if (typeof value === 'undefined' || value === null) {
        return ''
      }
      return value
    } catch {
      return ''
    }
  }

  static exec(code: string, getValue?: (id: string) => any) {
    try {
      const tokens = Formula.tokenize(code)
      const ast = Formula.parse(tokens)
      return Formula.run(ast, getValue)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return ''
    }
  }
}
