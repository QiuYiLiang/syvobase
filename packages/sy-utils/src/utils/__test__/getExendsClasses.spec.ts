import { describe, it, expect } from 'vitest'
import { getExendsClasses } from '../getExendsClasses'

describe('getExendsClasses 获取继承链类', () => {
  it('应该返回普通对象的空继承链', () => {
    const obj = {}
    const result = getExendsClasses(obj)
    expect(result).toEqual([])
  })

  it('应该返回单个类实例的继承链', () => {
    class Animal {}
    const animal = new Animal()
    const result = getExendsClasses(animal)
    expect(result).toEqual([Animal])
  })

  it('应该按顺序返回多级继承链', () => {
    class Animal {}
    class Mammal extends Animal {}
    class Dog extends Mammal {}

    const dog = new Dog()
    const result = getExendsClasses(dog)

    expect(result).toEqual([Animal, Mammal, Dog])
  })

  it('应该处理深层继承链', () => {
    class A {}
    class B extends A {}
    class C extends B {}
    class D extends C {}
    class E extends D {}

    const e = new E()
    const result = getExendsClasses(e)

    expect(result).toEqual([A, B, C, D, E])
  })

  it('应该正确处理内置类的继承', () => {
    class CustomArray extends Array {}
    const arr = new CustomArray()
    const result = getExendsClasses(arr)

    expect(result).toContain(Array)
    expect(result).toContain(CustomArray)
  })

  it('应该正确处理 Error 继承', () => {
    class CustomError extends Error {}
    const err = new CustomError()
    const result = getExendsClasses(err)

    expect(result).toContain(Error)
    expect(result).toContain(CustomError)
  })

  it('应该处理具有构造函数的类', () => {
    class Person {
      name: string
      constructor(name: string) {
        this.name = name
      }
    }

    class Employee extends Person {
      id: number
      constructor(name: string, id: number) {
        super(name)
        this.id = id
      }
    }

    const emp = new Employee('John', 123)
    const result = getExendsClasses(emp)

    expect(result).toEqual([Person, Employee])
  })

  it('应该处理带有静态方法和属性的类', () => {
    class Base {
      static staticProp = 'base'
      static staticMethod() {
        return 'base'
      }
    }

    class Derived extends Base {
      static staticProp = 'derived'
    }

    const derived = new Derived()
    const result = getExendsClasses(derived)

    expect(result).toEqual([Base, Derived])
  })

  it('应该处理匿名类', () => {
    const AnonymousClass = class {
      value = 1
    }
    const instance = new AnonymousClass()
    const result = getExendsClasses(instance)

    expect(result.length).toBe(1)
    expect(result[0]).toBe(AnonymousClass)
  })

  it('应该处理通过 Object.create 创建的对象', () => {
    class Parent {}
    const proto = new Parent()
    const child = Object.create(proto)
    const result = getExendsClasses(child)

    expect(result).toContain(Parent)
  })
})
