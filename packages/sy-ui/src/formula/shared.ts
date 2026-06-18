export interface FormulaFunc {
  id: string
  template: string
  describe: {
    usage: string // 用法
    examples: string[] // 示例
    explanation: string // 说明
  }
}

export const numberFuns: FormulaFunc[] = [
  {
    id: 'MAX',
    template: 'MAX(,)',
    describe: {
      usage: 'MAX(数值1, 数值2, ...)',
      examples: ['MAX(3, 4, 2)=4'],
      explanation:
        '返回参数列表中的最大数值。如果参数中有非数值类型，将会被自动转换为数值类型后参与比较。',
    },
  },
  {
    id: 'MIN',
    template: 'MIN(,)',
    describe: {
      usage: 'MIN(数值1, 数值2, ...)',
      examples: ['MIN(3, 4, 2)=2'],
      explanation:
        '返回参数列表中的最小数值。如果参数中有非数值类型，将会被自动转换为数值类型后参与比较。',
    },
  },
  {
    id: 'AVG',
    template: 'AVG(,)',
    describe: {
      usage: 'AVG(数值1, 数值2, ...)',
      examples: ['AVG(3, 4, 2)=3'],
      explanation:
        '计算所有参数的算术平均值（总和除以参数个数）。如果参数为空，则返回0。',
    },
  },
  {
    id: 'SUM',
    template: 'SUM(,)',
    describe: {
      usage: 'SUM(数值1, 数值2, ...)',
      examples: ['SUM(3, 4, 2)=9'],
      explanation: '将所有参数进行累加，返回总和。参数可以为任意数值类型。',
    },
  },
  {
    id: 'ROUND',
    template: 'ROUND(,)',
    describe: {
      usage: 'ROUND(数值, 位数)',
      examples: ['ROUND(3.14159, 2)=3.14'],
      explanation:
        '对数值进行四舍五入处理，第二个参数指定保留的小数位数。返回处理后的新数值。',
    },
  },
  {
    id: 'TRUNCATE',
    template: 'TRUNCATE(,)',
    describe: {
      usage: 'TRUNCATE(数值, 位数)',
      examples: ['TRUNCATE(3.14159, 2)=3.14'],
      explanation:
        '将数值的小数部分截断到指定的位数，不进行四舍五入。返回截断后的新数值。',
    },
  },
  {
    id: 'POWER',
    template: 'POWER(,)',
    describe: {
      usage: 'POWER(底数, 指数)',
      examples: ['POWER(2, 3)=8'],
      explanation: '返回底数的指数次幂，即底数自乘指定次数后的结果。',
    },
  },
  {
    id: 'ABS',
    template: 'ABS()',
    describe: {
      usage: 'ABS(数值)',
      examples: ['ABS(-3)=3'],
      explanation: '返回数值的绝对值，即去除符号后的非负数。',
    },
  },
  {
    id: 'MOD',
    template: 'MOD(,)',
    describe: {
      usage: 'MOD(被除数, 除数)',
      examples: ['MOD(7, 3)=1'],
      explanation: '返回被除数除以除数后的余数。常用于判断数值是否整除。',
    },
  },
  {
    id: 'RANDOM',
    template: 'RANDOM(,)',
    describe: {
      usage: 'RANDOM(最小值, 最大值)',
      examples: ['RANDOM(1, 10)'],
      explanation: '在指定范围内生成一个随机数，包含最小值但不包含最大值。',
    },
  },
  {
    id: 'TOSTRING',
    template: 'TOSTRING()',
    describe: {
      usage: 'TOSTRING(数值)',
      examples: ["TOSTRING(123)='123'"],
      explanation: '将数值类型转换为字符串类型，便于文本处理或拼接。',
    },
  },
]
export const dateFuns: FormulaFunc[] = [
  {
    id: 'NOW',
    template: 'NOW()',
    describe: {
      usage: 'NOW()',
      examples: ['NOW()=2025-08-19T12:34:56.789Z'],
      explanation: '返回当前的日期和时间，结果为 Date 对象。',
    },
  },
  {
    id: 'TODAY',
    template: 'TODAY()',
    describe: {
      usage: 'TODAY()',
      examples: ['TODAY()=2025-08-19'],
      explanation: '返回当天的日期，时间部分为零点（00:00:00）。',
    },
  },
  {
    id: 'DATESTR',
    template: 'DATESTR()',
    describe: {
      usage: 'DATESTR(日期)',
      examples: ['DATESTR(NOW())=2025-08-19'],
      explanation: '将日期对象转换为字符串，格式为 yyyy-mm-dd。',
    },
  },
  {
    id: 'EXTRACT',
    template: 'EXTRACT(,)',
    describe: {
      usage: 'EXTRACT(日期, 部分)',
      examples: ["EXTRACT('2025-08-19', 'year')=2025"],
      explanation: '从日期中提取指定部分，如年份、月份、日期、小时、分钟或秒。',
    },
  },
  {
    id: 'DATEDELTA',
    template: 'DATEDELTA(,)',
    describe: {
      usage: 'DATEDELTA(日期1, 日期2)',
      examples: ["DATEDELTA('2025-08-19', '2025-08-18')=1"],
      explanation: '计算两个日期之间相差的天数，结果为整数。',
    },
  },
  {
    id: 'DATEADD',
    template: 'DATEADD(,)',
    describe: {
      usage: 'DATEADD(日期, 天数)',
      examples: ["DATEADD('2025-08-19', 1)=2025-08-20"],
      explanation:
        '在指定日期基础上增加（或减少）指定的天数，返回新的日期对象。',
    },
  },
  {
    id: 'MONTHDAYS',
    template: 'MONTHDAYS()',
    describe: {
      usage: 'MONTHDAYS(日期)',
      examples: ["MONTHDAYS('2025-08-19')=31"],
      explanation: '返回指定日期所在月份的总天数。',
    },
  },
  {
    id: 'DAYOFYEAR',
    template: 'DAYOFYEAR()',
    describe: {
      usage: 'DAYOFYEAR(日期)',
      examples: ["DAYOFYEAR('2025-08-19')=231"],
      explanation: '返回指定日期是一年中的第几天（1~366）。',
    },
  },
  {
    id: 'WEEKOFYEAR',
    template: 'WEEKOFYEAR()',
    describe: {
      usage: 'WEEKOFYEAR(日期)',
      examples: ["WEEKOFYEAR('2025-08-19')=34"],
      explanation: '返回指定日期是一年中的第几周。',
    },
  },
  {
    id: 'DATE',
    template: 'DATE(,,)',
    describe: {
      usage: 'DATE(年, 月, 日)',
      examples: ['DATE(2025, 8, 19)=2025-08-19'],
      explanation: '根据指定的年、月、日生成一个日期对象。',
    },
  },
  {
    id: 'WEEKDAYNUM',
    template: 'WEEKDAYNUM()',
    describe: {
      usage: 'WEEKDAYNUM(日期)',
      examples: ["WEEKDAYNUM('2025-08-19')=2"],
      explanation: '返回指定日期对应的星期几，0 表示周日，1~6 表示周一到周六。',
    },
  },
  {
    id: 'WEEKDAYSTR',
    template: 'WEEKDAYSTR()',
    describe: {
      usage: 'WEEKDAYSTR(日期)',
      examples: ["WEEKDAYSTR('2025-08-19')=周二"],
      explanation: '返回指定日期对应的中文星期几，如“周一”、“周二”等。',
    },
  },
  {
    id: 'MONTHSTART',
    template: 'MONTHSTART()',
    describe: {
      usage: 'MONTHSTART(日期)',
      examples: ["MONTHSTART('2025-08-19')=2025-08-01"],
      explanation: '返回指定日期所在月份的第一天日期对象。',
    },
  },
  {
    id: 'MONTHEND',
    template: 'MONTHEND()',
    describe: {
      usage: 'MONTHEND(日期)',
      examples: ["MONTHEND('2025-08-19')=2025-08-31"],
      explanation: '返回指定日期所在月份的最后一天日期对象。',
    },
  },
  {
    id: 'TIMESTAMPFORMAT',
    template: 'TIMESTAMPFORMAT(,)',
    describe: {
      usage: 'TIMESTAMPFORMAT(日期, 格式)',
      examples: [
        "TIMESTAMPFORMAT('2025-08-19T12:34:56', 'yyyy-MM-dd HH:mm:ss')=2025-08-19 12:34:56",
      ],
      explanation:
        '将日期对象格式化为指定的字符串格式，如 yyyy-MM-dd HH:mm:ss。',
    },
  },
]
export const textFuns: FormulaFunc[] = [
  {
    id: 'CONCAT',
    template: 'CONCAT(,)',
    describe: {
      usage: 'CONCAT(文本1, 文本2, ...)',
      examples: ["CONCAT('a', 'b')='ab'"],
      explanation: '将多个文本内容拼接为一个新的字符串。',
    },
  },
  {
    id: 'REPLACE',
    template: 'REPLACE(,,)',
    describe: {
      usage: 'REPLACE(文本, 查找, 替换)',
      examples: ["REPLACE('abcabc', 'a', 'x')='xbcxbc'"],
      explanation: '将文本中的指定内容全部替换为新的内容，支持正则表达式。',
    },
  },
  {
    id: 'INSERT',
    template: 'INSERT(,,)',
    describe: {
      usage: 'INSERT(文本, 插入内容, 位置)',
      examples: ["INSERT('abc', 'x', 1)='axbc'"],
      explanation: '在指定位置插入新的文本内容，返回插入后的新字符串。',
    },
  },
  {
    id: 'LEFT',
    template: 'LEFT(,)',
    describe: {
      usage: 'LEFT(文本, 长度)',
      examples: ["LEFT('abc', 2)='ab'"],
      explanation: '返回文本左侧指定长度的子字符串。',
    },
  },
  {
    id: 'RIGHT',
    template: 'RIGHT(,)',
    describe: {
      usage: 'RIGHT(文本, 长度)',
      examples: ["RIGHT('abc', 2)='bc'"],
      explanation: '返回文本右侧指定长度的子字符串。',
    },
  },
  {
    id: 'MID',
    template: 'MID(,,)',
    describe: {
      usage: 'MID(文本, 起始, 长度)',
      examples: ["MID('abcdef', 2, 3)='cde'"],
      explanation: '返回文本中间指定位置和长度的子字符串。',
    },
  },
  {
    id: 'LEN',
    template: 'LEN()',
    describe: {
      usage: 'LEN(文本)',
      examples: ["LEN('abc')=3"],
      explanation: '返回文本的字符长度。',
    },
  },
  {
    id: 'TRIM',
    template: 'TRIM()',
    describe: {
      usage: 'TRIM(文本)',
      examples: ["TRIM('  abc  ')='abc'"],
      explanation: '去除文本首尾的所有空格，返回处理后的新字符串。',
    },
  },
  {
    id: 'LOCATE',
    template: 'LOCATE(,)',
    describe: {
      usage: 'LOCATE(查找内容, 文本)',
      examples: ["LOCATE('b', 'abc')=1"],
      explanation:
        '查找指定内容在文本中的位置，返回首次出现的索引（从0开始）。',
    },
  },
  {
    id: 'IDCARDBIRTHDAY',
    template: 'IDCARDBIRTHDAY()',
    describe: {
      usage: 'IDCARDBIRTHDAY(身份证号)',
      examples: ["IDCARDBIRTHDAY('110101199003071234')='19900307'"],
      explanation: '从18位身份证号中提取出生日期（格式为yyyyMMdd）。',
    },
  },
  {
    id: 'IDCARDSEX',
    template: 'IDCARDSEX()',
    describe: {
      usage: 'IDCARDSEX(身份证号)',
      examples: ["IDCARDSEX('110101199003071234')='男'"],
      explanation: '根据18位身份证号判断性别，奇数为男，偶数为女。',
    },
  },
  {
    id: 'TONUMBER',
    template: 'TONUMBER()',
    describe: {
      usage: 'TONUMBER(文本)',
      examples: ["TONUMBER('123')=123"],
      explanation: '将文本内容转换为数值类型，便于数值运算。',
    },
  },
]
export const logicFuns: FormulaFunc[] = [
  {
    id: 'IF',
    template: 'IF(,,)',
    describe: {
      usage: 'IF(条件, 为真值, 为假值)',
      examples: ['IF(1>0, "yes", "no")="yes"'],
      explanation: '条件判断',
    },
  },
  {
    id: 'IFS',
    template: 'IFS(,,)',
    describe: {
      usage: 'IFS(条件1, 值1, 条件2, 值2, ...)',
      examples: ['IFS(1>2, "a", 2>1, "b")="b"'],
      explanation: '多条件判断',
    },
  },
  {
    id: 'AND',
    template: 'AND(,)',
    describe: {
      usage: 'AND(条件1, 条件2, ...)',
      examples: ['AND(true, false)=false'],
      explanation: '所有条件为真',
    },
  },
  {
    id: 'OR',
    template: 'OR(,)',
    describe: {
      usage: 'OR(条件1, 条件2, ...)',
      examples: ['OR(true, false)=true'],
      explanation: '任一条件为真',
    },
  },
  {
    id: 'EMPTY',
    template: 'EMPTY()',
    describe: {
      usage: 'EMPTY(值)',
      examples: ['EMPTY("")=true'],
      explanation: '是否为空',
    },
  },
  {
    id: 'ISEMPTY',
    template: 'ISEMPTY()',
    describe: {
      usage: 'ISEMPTY(值)',
      examples: ['ISEMPTY(null)=true'],
      explanation: '是否为空',
    },
  },
  {
    id: 'ISNOTEMPTY',
    template: 'ISNOTEMPTY()',
    describe: {
      usage: 'ISNOTEMPTY(值)',
      examples: ['ISNOTEMPTY("abc")=true'],
      explanation: '是否非空',
    },
  },
  {
    id: 'EMPTYSTR',
    template: 'EMPTYSTR()',
    describe: {
      usage: 'EMPTYSTR()',
      examples: ['EMPTYSTR()=""'],
      explanation: '空字符串',
    },
  },
  {
    id: 'DEFAULTVALUE',
    template: 'DEFAULTVALUE(,)',
    describe: {
      usage: 'DEFAULTVALUE(值, 默认值)',
      examples: ['DEFAULTVALUE("", "abc")="abc"'],
      explanation: '空值时返回默认值',
    },
  },
]

export const allFuns = [...numberFuns, ...dateFuns, ...textFuns, ...logicFuns]
