type QueryOpStatement = Partial<{
  or: string[];
  and: string[];
  [key: string]: string[];
}>;

interface QueryStatement {
  mimeType?: QueryOpStatement | string;
  folder?: QueryOpStatement | string;
}

interface TestType {
  [key: 'hi' | 'no']: string[];
}

function isString(val: QueryOpStatement | string): val is string {
  return typeof val === 'string';
}

export class DriveQuery {
  private query: QueryStatement;

  constructor(query: QueryStatement) {
    this.query = query;
  }

  toString(): string {
    console.log(this.query);
    const queries = Object.keys(this.query)
      .filter((attr: keyof QueryStatement) => !!this.query[attr])
      .map((attr: keyof QueryStatement) => {
        const value: QueryOpStatement | string = this.query[attr];

        switch (attr) {
          case 'mimeType':
            if (isString(value)) {
              return `${attr} = '${value}'`;
            } else {
              const op: string = Object.keys(value).pop();
              return (value[op] as string[])
                .map((val) => `${attr} = '${val}'`)
                .join(` ${op} `);
            }
          case 'folder':
            if (isString(value)) {
              return `'${this.query[attr]}' in parents`;
            } else {
              const op: string = Object.keys(value).pop();
              return (value[op] as string[])
                .map((val) => `'${val}' in parents`)
                .join(op);
            }
        }
      });

    return queries.map((query) => `(${query})`).join(' and ');
  }
}
