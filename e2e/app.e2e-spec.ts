import { VbridgePage } from './app.po';

describe('vbridge App', function() {
  let page: VbridgePage;

  beforeEach(() => {
    page = new VbridgePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
