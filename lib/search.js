const rp = require('minimal-request-promise');
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function checkForThumbnail(picture_index, results) {
  let photo = results[picture_index];
  if (photo.image.alt != 'digitized item thumbnail') {
    console.log('checking another index');
    let another_index = getRandomIntInclusive(0,results.length);
    return checkForThumbnail(another_index, results);
  } else {
    return photo;
  }
}
function getSearch(search_term){
  const url_message = encodeURIComponent(search_term);
  return rp.get(`http://www.loc.gov/pictures/search/?q=${url_message}&fo=json&fa=displayed%3Aanywhere`)
    .then(response => {
      const body = JSON.parse(response.body);
      const results = body.results;
      let picture_index = getRandomIntInclusive(0,results.length);
      const photo = checkForThumbnail(picture_index, results);
      let title = photo.title;
      //Grab [here's the title]
      if (photo.title.indexOf('[') === 0 && photo.title.indexOf(']') != -1) {
        title = photo.title.slice(1,-1);
      }
      const picture = {'thumbnail':photo.image.thumb, 'title': title, 'link': photo.links.item, };
      return picture;
    });
}

module.exports = {
  getSearch: getSearch,
}
