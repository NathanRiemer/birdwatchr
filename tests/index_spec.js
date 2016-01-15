describe('visiting the site', function(){
  it('greets the user', function(){
    browser.get('http://localhost:3000')
    var h1 = element(by.css('.splash'));
    expect(h1.getText()).toEqual("What's up, dog?");
  });
  it('adds a dog', function(){
    browser.get('http://localhost:3000');
    element(by.model('dogs.new')).sendKeys('Jerry');
    element(by.id('save')).click();
    var dogsList = element.all(by.repeater('dog in dogs.all'));
    expect(dogsList.last().getText()).toEqual('Jerry');
  })
});
