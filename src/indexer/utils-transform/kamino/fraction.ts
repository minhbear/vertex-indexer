import BN from 'bn.js';
import Decimal from 'decimal.js';

export class Fraction {
  static MAX_SIZE_F = 128;
  static MAX_SIZE_BF = 256;
  static FRACTIONS = 60;
  static MULTIPLIER_NUMBER = Math.pow(2, Fraction.FRACTIONS);

  static MAX_BN = new BN(2).pow(new BN(Fraction.MAX_SIZE_BF)).sub(new BN(1));
  static MIN_BN = new BN(0);
  static U64_BASE = new BN('10000000000000000', 16);

  valueSf: BN;

  constructor(valueSf: BN | string) {
    if (!BN.isBN(valueSf)) {
      valueSf = new BN(valueSf);
    }

    if (valueSf.lt(Fraction.MIN_BN) || valueSf.gt(Fraction.MAX_BN)) {
      throw new Error('Number out of range');
    }

    this.valueSf = valueSf;
  }

  toDecimal(): Decimal {
    return new Decimal(this.valueSf.toString()).div(Fraction.MULTIPLIER_NUMBER);
  }

  static toDecimalFrom(value: string): Decimal {
    return new Decimal(value).div(Fraction.MULTIPLIER_NUMBER);
  }

  static toDecimalFromBfs(values: BN[]): Decimal {
    const u256Array = values.map((value) => new BN(value.toString(), 16));
    let result = new BN(0);
    for (let i = 0; i < u256Array.length; i++) {
      result = result.add(u256Array[i].mul(Fraction.U64_BASE.pow(new BN(i))));
    }

    return Fraction.toDecimalFrom(result.toString());
  }

  static fromDecimal(n: Decimal): Fraction {
    const MULTIPLIER_DECIMAL = new Decimal(
      Fraction.MULTIPLIER_NUMBER.toString(),
    );
    const scaledDecimal = n.mul(MULTIPLIER_DECIMAL).round();
    const scaledValue = new BN(scaledDecimal.toString());

    return new Fraction(scaledValue);
  }

  static fromBps(n: Decimal): Fraction {
    const decimal = n.div(10000);
    return Fraction.fromDecimal(decimal);
  }

  static fromPercent(n: number): Fraction {
    const decimal = new Decimal(n).div(100);
    return Fraction.fromDecimal(decimal);
  }

  getValue(): BN {
    return this.valueSf;
  }

  gt(x: Fraction): boolean {
    return this.valueSf.gt(x.getValue());
  }

  lt(x: Fraction): boolean {
    return this.valueSf.lt(x.getValue());
  }

  gte(x: Fraction): boolean {
    return this.valueSf.gte(x.getValue());
  }

  lte(x: Fraction): boolean {
    return this.valueSf.lte(x.getValue());
  }

  eq(x: Fraction): boolean {
    return this.valueSf.eq(x.getValue());
  }
}

export const ZERO_FRACTION = new Fraction(new BN(0));
