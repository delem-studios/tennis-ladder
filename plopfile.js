import componentGenerator from './generators/component/index.js';
import featureGenerator from './generators/feature/index.js';
import featureComponentGenerator from './generators/featureComponent/index.js';
import pageGenerator from './generators/page/index.js';

export default function (plop) {
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('feature', featureGenerator);
  plop.setGenerator('featureComponent', featureComponentGenerator);
  plop.setGenerator('page', pageGenerator);
}
