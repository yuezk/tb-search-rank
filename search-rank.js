var http = require('http');
var colors = require('colors');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');


//search vars
var q = '三合一户外冲锋衣 男';
var searchUrl = 'http://s.taobao.com/search?q=';
var pageSize = 44;
var maxPageNum = 100;
var sellerName = '加油魔童';
//sellerName = '衣家兄弟';

var lineNum = 0;

var callback;
var result = [];
var errResult = [];

var fetchPage = function (fetchUrl, pageNum) {
  http.get(fetchUrl, function (res) {
    handleResponse(res, pageNum);
  }).on('error', function (e) {
    console.error('featch html faild! url: %s; msg: %s at page %d', fetchUrl, e, pageNum);
    //出错的结果
    errResult.push({
      url: fetchUrl,
      pageNum: pageNum + 1,
      e: e
    });
  });
};

function handleResponse(res, pageNum) {

  var chunks = [];
  var size = 0;
  
  res.on('data', function (chunk) {
    chunks.push(chunk);
    size += chunk.length;
  });

  res.on('end', function () {
    console.log('%d. 正在解析第%d页数据', ++lineNum, pageNum + 1);

    var buf = Buffer.concat(chunks, size);
    var html = iconv.decode(buf, 'gbk');
    
    var $ = cheerio.load(html);
    $('.grid-view').children().each(function (i, item) {
      var $this = $(this);
      var seller = $this.find('.seller a').text().trim();

      if (seller == sellerName) {
        console.log('恭喜您，找到一款宝贝！在第%d页'.red, pageNum + 1);
        console.log('Title: '.green, $this.find('.summary').text().trim().green);
        console.log('Link: '.green, $this.find('.summary a').attr('href').green);

        result.push({
          title: $this.find('.summary').text().trim(),
          link: $this.find('.summary a').attr('href'),
          pageNum: pageNum + 1
        });
      }
    });

    if (lineNum === maxPageNum) { //全部解析完成
      result.sort(function (a, b) {
        return a.pageNum - b.pageNum; 
      });
      callback(null, result, errResult); 
    }
  });
}

var start = function () {
  for (var i = 0; i < maxPageNum; i++) {
    fetchPage(searchUrl + q + '&s=' + i * pageSize, i);
  }
}

var search = function (wd, seller, cb) {
  q = wd;
  sellerName = seller;
  callback = typeof cb === 'function' ? cb : function () {};

  start();
};

exports.search = search;

