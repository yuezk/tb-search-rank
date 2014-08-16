#!/usr/bin/env node

var program = require('commander');
var SearchRank = require('./search-rank');


//-q '希维途 冲锋衣'
//-s '加油魔童'
var q;
var s;

program
  .version('0.0.1')
  .option('-q, --query <value>', 'Search keyword')
  .option('-s, --seller <value>', 'The seller name')
  .parse(process.argv);

q = program.query;
s = program.seller;

SearchRank.search(q, s, function (err, result, failedResult) {
  if (err) {
    console.log(err);
    return;
  }

  result.forEach(function (item) {
    console.log(item);
  });

  //console.log(errResult);
});
