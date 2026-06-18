import { describe, it, expect } from 'vitest'
import { Formula } from '../Formula'

describe('Formula', () => {
  it('should calculate basic arithmetic', () => {
    expect(Formula.exec('1+2')).toBe(3)
    expect(Formula.exec('2*3')).toBe(6)
    expect(Formula.exec('8/2')).toBe(4)
    expect(Formula.exec('5-3')).toBe(2)
    expect(Formula.exec('2+3*4')).toBe(14)
    expect(Formula.exec('(2+3)*4')).toBe(20)
    // 边界值和特殊情况
    expect(Formula.exec('999999999+1')).toBe(1000000000)
    expect(Formula.exec('-999999999-1')).toBe(-1000000000)
    expect(Formula.exec('1.5+2.5')).toBe(4)
    expect(Formula.exec('0.1+0.2')).toBeCloseTo(0.3)
    expect(Formula.exec('1/3')).toBeCloseTo(1 / 3)
    expect(Formula.exec('1/0')).toBe('')
    expect(Formula.exec('0/0')).toBe('')
    expect(Formula.exec('Infinity-1')).toBe('')
    expect(Formula.exec('1+-2')).toBe(-1)
    expect(Formula.exec('1--2')).toBe(3)
    expect(Formula.exec('1---2')).toBe(-1)
    expect(Formula.exec('1+--2')).toBe(3)
    expect(Formula.exec('')).toBe('')
    expect(Formula.exec(' ')).toBe('')
    expect(Formula.exec('1+')).toBe('')
    expect(Formula.exec('+')).toBe('')
    expect(Formula.exec('1+2+3+4+5')).toBe(15)
    expect(Formula.exec('((((1+2))))')).toBe(3)
    expect(Formula.exec('1+(2*(3+(4*5)))')).toBe(1 + 2 * (3 + 4 * 5))
  })

  it('should compare values', () => {
    expect(Formula.exec('2>1')).toBe(true)
    expect(Formula.exec('2<1')).toBe(false)
    expect(Formula.exec('2>=2')).toBe(true)
    expect(Formula.exec('2<=3')).toBe(true)
    expect(Formula.exec('2==2')).toBe(true)
    expect(Formula.exec('2!=3')).toBe(true)
    // 类型混合比较
    expect(Formula.exec('"2">1')).toBe(true)
    expect(Formula.exec('"2"==2')).toBe(true)
    expect(Formula.exec('"abc"=="abc"')).toBe(true)
    expect(Formula.exec('"abc"!=123')).toBe(true)
    expect(Formula.exec('1<"2"')).toBe(true)
    expect(Formula.exec('1>"2"')).toBe(false)
  })

  it('should parse numbers, strings, identifiers', () => {
    expect(Formula.exec('123')).toBe(123)
    expect(Formula.exec('"abc"')).toBe('abc')
    expect(Formula.exec("'xyz'")).toBe('xyz')
    expect(Formula.exec('#(foo)', (id) => id + '_val')).toBe('foo_val')
    // 空字符串、特殊字符
    expect(Formula.exec('""')).toBe('')
    expect(Formula.exec("''")).toBe('')
    expect(Formula.exec('"!@#$%^&*()"')).toBe('!@#$%^&*()')
    expect(Formula.exec('"中文"')).toBe('中文')
    expect(Formula.exec('#(bar)', () => null)).toBe('')
    expect(Formula.exec('#(baz)', () => undefined)).toBe('')
    expect(Formula.exec('#(baz)')).toBe('')
  })

  it('should call functions', () => {
    expect(Formula.exec('SUM(1,2,3)')).toBe(6)
    expect(Formula.exec('MAX(1,5,3)')).toBe(5)
    expect(Formula.exec('MIN(1,5,3)')).toBe(1)
    expect(Formula.exec('AVG(2,4,6)')).toBe(4)
    expect(Formula.exec('ROUND(3.14159,2)')).toBe(3.14)
    expect(Formula.exec('ABS(-5)')).toBe(5)
    expect(Formula.exec('MOD(10,3)')).toBe(1)
    expect(typeof Formula.exec('RANDOM(1,2)')).toBe('number')
    expect(Formula.exec('CONCAT("a","b","c")')).toBe('abc')
    expect(Formula.exec('LEFT("abcdef",3)')).toBe('abc')
    expect(Formula.exec('RIGHT("abcdef",2)')).toBe('ef')
    expect(Formula.exec('LEN("hello")')).toBe(5)
    expect(Formula.exec('TONUMBER("123")')).toBe(123)
    // 边界和类型
    expect(Formula.exec('SUM()')).toBe(0)
    expect(Formula.exec('MAX()')).toBe('')
    expect(Formula.exec('MIN()')).toBe('')
    expect(Formula.exec('AVG()')).toBe(0)
    expect(Formula.exec('ROUND(3.14159)')).toBe(3)
    expect(Formula.exec('ABS("-5")')).toBe(5)
    expect(Formula.exec('MOD(10,0)')).toBe('')
    expect(Formula.exec('CONCAT()')).toBe('')
    expect(Formula.exec('LEFT("abcdef",0)')).toBe('')
    expect(Formula.exec('RIGHT("abcdef",0)')).toBe('abcdef')
    expect(Formula.exec('LEN("")')).toBe(0)
    expect(Formula.exec('TONUMBER("")')).toBe(0)
    expect(Formula.exec('TONUMBER("abc")')).toBe('')
    expect(Formula.exec('TRUNCATE(3.14159,2)')).toBe(3.14)
    expect(Formula.exec('POWER(2,3)')).toBe(8)
    expect(typeof Formula.exec('TOSTRING(123)')).toBe('string')
  })

  it('should handle logic functions', () => {
    expect(Formula.exec('IF(1>0,"yes","no")')).toBe('yes')
    expect(Formula.exec('IF(0,"yes","no")')).toBe('no')
    expect(Formula.exec('AND(1,1,1)')).toBe(true)
    expect(Formula.exec('OR(0,0,1)')).toBe(true)
    expect(Formula.exec('EMPTY("")')).toBe(true)
    expect(Formula.exec('ISEMPTY("")')).toBe(true)
    expect(Formula.exec('ISNOTEMPTY("abc")')).toBe(true)
    expect(Formula.exec('DEFAULTVALUE("",123)')).toBe(123)
    expect(Formula.exec('DEFAULTVALUE("abc",123)')).toBe('abc')
    // 逻辑边界
    expect(Formula.exec('AND()')).toBe(true)
    expect(Formula.exec('OR()')).toBe(false)
    expect(Formula.exec('ISNOTEMPTY("")')).toBe(false)
    expect(Formula.exec('DEFAULTVALUE("","")')).toBe('')
    expect(Formula.exec('IFS(0,"a",1,"b")')).toBe('b')
    expect(Formula.exec('IFS(0,"a",0,"b")')).toBe('')
    expect(Formula.exec('EMPTYSTR()')).toBe('')
  })

  it('should handle date functions', () => {
    const today = Formula.exec('DATESTR(TODAY())')
    expect(typeof today).toBe('string')
    expect(today.length).toBe(10)
    const now = Formula.exec('NOW()')
    expect(now instanceof Date).toBe(true)
    expect(Formula.exec('EXTRACT("2023-08-20","year")')).toBe(2023)
    expect(Formula.exec('EXTRACT("2023-08-20","month")')).toBe(8)
    expect(Formula.exec('EXTRACT("2023-08-20","day")')).toBe(20)
    expect(Formula.exec('DATEDELTA("2023-08-21","2023-08-20")')).toBe(1)
    expect(Formula.exec('DATEADD("2023-08-20",5)') instanceof Date).toBe(true)
    expect(Formula.exec('MONTHDAYS("2023-02-01")')).toBe(28)
    expect(Formula.exec('DAYOFYEAR("2023-01-02")')).toBe(2)
    expect(Formula.exec('WEEKOFYEAR("2023-01-08")')).toBe(2)
    expect(Formula.exec('DATE(2023,8,20)') instanceof Date).toBe(true)
    expect(Formula.exec('WEEKDAYNUM("2023-08-20")')).toBe(0)
    expect(typeof Formula.exec('WEEKDAYSTR("2023-08-20")')).toBe('string')
    expect(
      Formula.exec(
        'TIMESTAMPFORMAT("2023-08-20T12:34:56","yyyy-MM-dd HH:mm:ss")'
      )
    ).toBe('2023-08-20 12:34:56')
    // 日期边界
    expect(Formula.exec('DATESTR("")')).toBe('')
    expect(Formula.exec('EXTRACT("2023-02-29","day")')).toBe(1)
    expect(Formula.exec('DATEDELTA("2023-08-20","2023-08-21")')).toBe(-1)
    expect(Formula.exec('DATEADD("2023-08-20",-5)') instanceof Date).toBe(true)
    expect(Formula.exec('MONTHDAYS("2024-02-01")')).toBe(29)
    expect(Formula.exec('DAYOFYEAR("2023-12-31")')).toBe(365)
    expect(Formula.exec('WEEKOFYEAR("2023-01-01")')).toBe(1)
    expect(Formula.exec('DATE(2023,2,29)') instanceof Date).toBe(true)
    expect(Formula.exec('WEEKDAYSTR("")')).toBe('')
    expect(Formula.exec('MONTHSTART("2023-08-20")') instanceof Date).toBe(true)
    expect(Formula.exec('MONTHEND("2023-08-20")') instanceof Date).toBe(true)
    expect(Formula.exec('TIMESTAMPFORMAT("2023-08-20T12:34:56")')).toBe(
      '2023-08-20 12:34:56'
    )
  })

  it('should handle special text functions', () => {
    expect(Formula.exec('REPLACE("abcabc","a","x")')).toBe('xbcxbc')
    expect(Formula.exec('INSERT("abc","X",1)')).toBe('aXbc')
    expect(Formula.exec('MID("abcdef",2,3)')).toBe('cde')
    expect(Formula.exec('TRIM("  abc  ")')).toBe('abc')
    expect(Formula.exec('LOCATE("b","abc")')).toBe(1)
    // 文本边界
    expect(Formula.exec('REPLACE("abcabc","z","x")')).toBe('abcabc')
    expect(Formula.exec('INSERT("abc","X",0)')).toBe('Xabc')
    expect(Formula.exec('INSERT("abc","X",3)')).toBe('abcX')
    expect(Formula.exec('MID("abcdef",0,2)')).toBe('ab')
    expect(Formula.exec('MID("abcdef",10,2)')).toBe('')
    expect(Formula.exec('TRIM("")')).toBe('')
    expect(Formula.exec('LOCATE("z","abc")')).toBe(-1)
  })

  it('should handle ID card functions', () => {
    expect(Formula.exec('IDCARDBIRTHDAY("11010519491231002X")')).toBe(
      '1949-12-31'
    )
    expect(Formula.exec('IDCARDSEX("11010519491231002X")')).toBe('女')
    expect(Formula.exec('IDCARDSEX("110105194912310019")')).toBe('男')
    // 身份证边界
    expect(Formula.exec('IDCARDBIRTHDAY("123456789012345")')).toBe('')
    expect(Formula.exec('IDCARDBIRTHDAY("")')).toBe('')
    expect(Formula.exec('IDCARDSEX("123456789012345")')).toBe('男')
    expect(Formula.exec('IDCARDSEX("")')).toBe('')
  })

  it('should handle errors gracefully', () => {
    expect(Formula.exec('1++2')).toBe(3)
    expect(Formula.exec('#(unknown)')).toBe('')
    expect(Formula.exec('1/0')).toBe('')
    // 错误分支
    expect(Formula.exec('SUM("a", "b")')).toBe('')
    expect(Formula.exec('MAX("a", "b")')).toBe('')
    expect(Formula.exec('MIN("a", "b")')).toBe('')
    expect(Formula.exec('AVG("a", "b")')).toBe('')
    expect(Formula.exec('ROUND("abc",2)')).toBe('')
    expect(Formula.exec('MOD("a", "b")')).toBe('')
    expect(Formula.exec('DATESTR("notadate")')).toBe('')
    expect(Formula.exec('EXTRACT("notadate","year")')).toBe('')
    expect(Formula.exec('DATEDELTA("notadate","2023-08-20")')).toBe('')
    expect(Formula.exec('MONTHDAYS("notadate")')).toBe('')
    expect(Formula.exec('DAYOFYEAR("notadate")')).toBe('')
    expect(Formula.exec('WEEKOFYEAR("notadate")')).toBe('')
    expect(Formula.exec('DATE("a","b","c")')).toBe('')
    expect(Formula.exec('WEEKDAYNUM("notadate")')).toBe('')
    expect(Formula.exec('WEEKDAYSTR("notadate")')).toBe('')
    expect(Formula.exec('MONTHSTART("notadate")')).toBe('')
    expect(Formula.exec('MONTHEND("notadate")')).toBe('')
    expect(Formula.exec('TIMESTAMPFORMAT("notadate")')).toBe(
      'NaN-NaN-NaN NaN:NaN:NaN'
    )
  })

  it('should support getValue callback for identifier', () => {
    expect(Formula.exec('#(foo)+#(bar)', (id) => (id === 'foo' ? 2 : 3))).toBe(
      5
    )
    // getValue 边界
    expect(Formula.exec('#(foo)+#(bar)', () => undefined)).toBe('')
    expect(Formula.exec('#(foo)+#(bar)', () => null)).toBe('')
  })

  it('should handle complex negative number scenarios', () => {
    // 连续负号
    expect(Formula.exec('--1')).toBe(1)
    expect(Formula.exec('-(-1)')).toBe(1)
    // 负数与括号
    expect(Formula.exec('-(1+2)')).toBe(-3)
    expect(Formula.exec('(-3)+4')).toBe(1)
    // 负数与函数
    expect(Formula.exec('SUM(-1,2,-3)')).toBe(-2)
    // 负数与比较
    expect(Formula.exec('-1<0')).toBe(true)
    expect(Formula.exec('-2>=-3')).toBe(true)
    // 负数与标识符混合
    expect(Formula.exec('-#(foo)+2', () => 5)).toBe(-3)
    // 负数与小数
    expect(Formula.exec('-1.5+2.5')).toBe(1)
    // 负数与嵌套表达式
    expect(Formula.exec('-(SUM(1,2)-3)')).toBe(0)
    // 负数边界
    expect(Formula.exec('---1')).toBe(-1)
    expect(Formula.exec('-(--1)')).toBe(-1)
    expect(Formula.exec('-(-(-1))')).toBe(-1)
    expect(Formula.exec('SUM(-1,-2,-3)')).toBe(-6)
    expect(Formula.exec('SUM(-1,0,1)')).toBe(0)
    expect(Formula.exec('SUM(-1.5,2.5)')).toBe(1)
    expect(Formula.exec('SUM(-Infinity,Infinity)')).toBe('')
  })

  it('should handle string concatenation', () => {
    // 基础字符串拼接
    expect(Formula.exec('CONCAT("Hello"," ","World")')).toBe('Hello World')
    expect(Formula.exec('CONCAT("你好","世界")')).toBe('你好世界')

    // 字符串与数字拼接
    expect(Formula.exec('CONCAT("数量: ",100)')).toBe('数量: 100')
    expect(Formula.exec('CONCAT("价格: ",3.14," 元")')).toBe('价格: 3.14 元')

    // 字符串与标识符拼接
    expect(
      Formula.exec('CONCAT("姓名: ",#(name))', (id) =>
        id === 'name' ? '张三' : ''
      )
    ).toBe('姓名: 张三')
    expect(
      Formula.exec('CONCAT(#(prefix)," - ",#(suffix))', (id) =>
        id === 'prefix' ? 'A' : 'B'
      )
    ).toBe('A - B')

    // 多个字符串拼接
    expect(Formula.exec('CONCAT("a","b","c","d","e")')).toBe('abcde')

    // 字符串拼接与其他函数组合
    expect(Formula.exec('CONCAT("总和: ",TOSTRING(SUM(1,2,3)))')).toBe(
      '总和: 6'
    )
    expect(Formula.exec('CONCAT(LEFT("hello",2),RIGHT("world",3))')).toBe(
      'herld'
    )

    // 特殊字符拼接
    expect(Formula.exec('CONCAT("符号: ","!@#$%")')).toBe('符号: !@#$%')
    expect(Formula.exec('CONCAT("换行","\\n","测试")')).toBe('换行\n测试')

    // 边界情况
    expect(Formula.exec('CONCAT("")')).toBe('')
    expect(Formula.exec('CONCAT("","","")')).toBe('')
    expect(Formula.exec('CONCAT("only")')).toBe('only')
  })
})
