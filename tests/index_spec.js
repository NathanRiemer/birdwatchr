describe('visiting the site', function(){
  it('greets the user', function(){
    browser.get('http://localhost:3000')
    var h2 = element(by.id('welcome'));
    expect(h2.getText()).toEqual("Welcome to Birdwatchr!");
  });
  it('adds a sighting', function(){
    browser.get('http://localhost:3000');
    element(by.model('sightings.newSighting.type')).sendKeys('Pigeon');
    element(by.model('sightings.newSighting.location')).sendKeys('New York, NY');
    element(by.id('save')).click();
    var sightingsList = element.all(by.repeater('sighting in sightings.all'));
    expect(sightingsList.first().element(by.binding('sighting.type')).getText()).toEqual('Pigeon spotted at New York, NY');
  })
});
