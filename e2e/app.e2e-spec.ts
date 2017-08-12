import { HankPage } from './app.po';

describe('hank App', () => {
  let page: HankPage;

  beforeEach(() => {
    page = new HankPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
