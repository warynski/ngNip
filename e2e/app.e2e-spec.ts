import { NgNipPage } from './app.po';

describe('ng-nip App', () => {
  let page: NgNipPage;

  beforeEach(() => {
    page = new NgNipPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
