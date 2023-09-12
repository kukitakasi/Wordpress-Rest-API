var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("WpAuto V1");
var excerptIn = sheet.getRange('B5').getValue();
var domain = sheet.getRange('B1').getValue();
var postBody = sheet.getRange('B9').getValue();
var title = sheet.getRange('B2').getValue();
var cate = sheet.getRange('B6').getValue();
var description = "";
var status = "publish";
var date = sheet.getRange('D1').getValue() + 'T12:00:00';
var postUrl = domain + '/wp-json/wp/v2/posts';
var urlFeture = sheet.getRange('B3').getValue();
var alttext = sheet.getRange('B4').getValue();
var imagePostURL = domain + '/wp-json/wp/v2/media';

var jwtToken = sheet.getRange('I1').getValue();


function wpJWT() {

  // Fetch the image data
  var imageBlob = UrlFetchApp.fetch(urlFeture).getBlob();

  // Create headers for the  feture img request
  var imageHeaders = {
    'Authorization': 'Bearer ' + jwtToken,
    'Content-Disposition': 'attachment; filename="' + imageBlob.getName() + '"',
    'Content-Type': imageBlob.getContentType()
  };

  // Create options for the featured image
  var options = {
    'method': 'post',
    'title': title,
    'alt_text': alttext,
    'headers': imageHeaders,
    'payload': imageBlob.getBytes()
  };

  var imgPostResponse = UrlFetchApp.fetch(imagePostURL, options);

  var jsonResponse = JSON.parse(imgPostResponse.getContentText());

  // Get image ID
  var featuredImageId = jsonResponse.id;
  Logger.log('Featured Image ID: ' + featuredImageId);
  Utilities.sleep(1000);

  // Define the payload for the new post
  var payload = {
    title: title,
    content: postBody,
    excerpt:excerptIn,
    status: status,
    date:date,
    featured_media: featuredImageId
  };
  // category ID by name
    var categoryId = getCategoryByName(cate);
      if (categoryId) {
      payload.categories = [categoryId];
    }


  // Create the options for the POST request
  var postOptions = {
    'method': 'POST',
    'headers': {
      'Authorization': 'Bearer ' + jwtToken,
      'Content-Type': 'application/json'
    },
    'payload': JSON.stringify(payload)
  };

  // give post request to api
  var postResponse = UrlFetchApp.fetch(postUrl, postOptions);

  // Check successfully
  if (postResponse.getResponseCode() === 201) {
    var responsePostData = JSON.parse(postResponse.getContentText());
    var postId = responsePostData.id;
    var postLink = responsePostData.link;

    Logger.log('Post successfully created. Post ID: ' + postId);
    Logger.log('Post URL: ' + postLink);
    } else {
    Logger.log('Error creating post. Response code: ' + postResponse.getResponseCode());
    Logger.log('Response content: ' + postResponse.getContentText());
    }
}
    // category ID
  function getCategoryByName(categoryName) {
    var apiUrl = domain+'/wp-json/wp/v2/categories?slug=' + encodeURIComponent(categoryName);
    var response = UrlFetchApp.fetch(apiUrl);
    var data = JSON.parse(response.getContentText());
    if (data.length > 0) {
      return data[0].id;
    }
    return null;
  }

