var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("your sheet name");
var excerptIn = sheet.getRange('your excerpt shell number').getValue();
var websiteUrl = sheet.getRange('your website url shell number').getValue(); //eg: https://www.example.com //https://example.com  (only this format)
var content = sheet.getRange('your post body content shell number').getValue();
var title = sheet.getRange('add your title here').getValue();
var cate = sheet.getRange('add category as a string').getValue(); // eg: Health, Lifestyle (only One)
var description = "";
var onlyDate = sheet.getRange('Your date shell number').getValue(); //ex: 2002-12-25
var publishDate = onlyDate + 'T12:00:00'; //here you can change your time format
var username = sheet.getRange('your wordpress username shell number').getValue();
var password = sheet.getRange('your wordpress pass shell number').getValue();
var apiUrl = websiteUrl + '/wp-json/wp/v2/posts';
var urlFeture = sheet.getRange('featured image url shell number').getValue();
var alttext = sheet.getRange('featured image alt text shell number').getValue();
var endImgUrl = websiteUrl + '/wp-json/wp/v2/media';


function postWordPress() {

var imageBlob = UrlFetchApp.fetch(urlFeture).getBlob();
/featured image authentication
var headersImg = {
'Authorization': 'Basic ' + Utilities.base64Encode(username + ':' + password),
};
//image option start here
var optionsImg = {
'method': 'POST',
'headers': headersImg,
'payload': {
'file': imageBlob,
'title': title,
'status': "publish",
'media_type': "image",
//'ping_status': "open",
'alt_text': alttext,
'caption': ""
},
};

var responseImg = UrlFetchApp.fetch(endImgUrl, optionsImg);

var responseDataImg = JSON.parse(responseImg.getContentText());

Logger.log(responseDataImg.id);
var crId = responseDataImg.id;
Utilities.sleep(1000);

// post body execution
// payload
var payload = {
title: title,
content: content,
featured_media: crId,
excerpt: excerptIn,
status: 'publish',
};

// category ID by name
var categoryId = getCategoryByName(cate);
if (categoryId) {
payload.categories = [categoryId];
}

payload.date = publishDate;

var headers = {
'Authorization': 'Basic ' + Utilities.base64Encode(username + ':' + password),
'Content-Type': 'application/json',
};

var options = {
'method': 'POST',
'headers': headers,
'payload': JSON.stringify(payload),
};

var response = UrlFetchApp.fetch(apiUrl, options);

// successful response
if (response.getResponseCode() === 201) {
Logger.log('Post successfully created.');
} else {
Logger.log('Error: ' + response.getResponseCode() + ' - ' + response.getContentText());
}
var responseData = JSON.parse(response.getContentText());
var postUrl = responseData.link; // This will contain the post URL
Logger.log('Post successfully created. URL: ' + postUrl);
sheet.getRange("your shell number where you want to write your post link").setValue(responseData.link); //here you can give shell number when post are created it will be story post url in your google sheet.
var ui = SpreadsheetApp.getUi();
ui.alert("Post Success :)" + "Post URL: " + postUrl);

}

// category ID
function getCategoryByName(categoryName) {
var apiUrl = websiteUrl+'/wp-json/wp/v2/categories?slug=' + encodeURIComponent(categoryName);
var response = UrlFetchApp.fetch(apiUrl);
var data = JSON.parse(response.getContentText());
if (data.length > 0) {
return data[0].id;
}
return null;
}
