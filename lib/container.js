import dotenv from 'dotenv';
import { omit } from 'lodash';
import db from '../models';

dotenv.config();

export default {
  ...omit(db, ['sequelize', 'Sequelize']),
};
