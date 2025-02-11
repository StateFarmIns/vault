import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MetadataShow extends Route {
  @service store;
  noReadAccess = false;

  beforeModel() {
    const { backend } = this.paramsFor('vault.cluster.secrets.backend');
    this.backend = backend;
  }

  model(params) {
    let { secret } = params;
    return this.store
      .queryRecord('secret-v2', {
        backend: this.backend,
        id: secret,
      })
      .catch(error => {
        // there was an error likely in read metadata.
        // still load the page and handle what you show by filtering for this property
        if (error.httpStatus === 403) {
          this.noReadAccess = true;
        }
      });
  }

  setupController(controller, model) {
    controller.set('backend', this.backend); // for backendCrumb
    controller.set('model', model);
    controller.set('noReadAccess', this.noReadAccess);
  }
}
