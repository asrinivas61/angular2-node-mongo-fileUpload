import { TopgearSpocPage } from './app.po';

describe('topgear-spoc App', () => {
  let page: TopgearSpocPage;

  beforeEach(() => {
    page = new TopgearSpocPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
