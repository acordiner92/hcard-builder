/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
import pgPromise, { IDatabase, utils, IMain } from 'pg-promise';
import { IInitOptions } from 'pg-promise';
import { IConnectionParameters } from 'pg-promise/typescript/pg-subset';

const pgOptions: IInitOptions = {
  receive: (data: unknown) => {
    camelizeColumns(data);
  },
};

/**
 * This method is used to map underscore variables in Postgres
 * to javascript camel-case variables using pg-promise library.
 *
 * @param {*} data
 */
const camelizeColumns = (data: any): void => {
  const template = data[0];
  for (const prop in template) {
    const camel = utils.camelize(prop);
    if (!(camel in template)) {
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  }
};

const pgInstance = pgPromise(pgOptions);

export type DatabaseConnection = {
  readonly connection: IMain;
  readonly client: IDatabase<unknown>;
};

export const getConnection = (
  configuration: IConnectionParameters,
): DatabaseConnection => ({
  connection: pgInstance,
  client: pgInstance(configuration),
});
