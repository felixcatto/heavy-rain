import { pick } from 'lodash';


export default (object, error = { errors: [] }, id = null) => ({
  id,
  ...object,
  errors: error.errors
    .map(el => pick(el, ['message', 'path']))
    |> (_ => _.reduce((acc, el) => ({
      ...acc,
      [el.path]: el.message,
    }), {})),
});
