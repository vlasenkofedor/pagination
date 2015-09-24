# Dynamic pagination in Bootstrap
Dual licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php) and [GPL](http://www.gnu.org/licenses/gpl.html) licenses

Support [AMD Module](https://github.com/amdjs/amdjs-api/blob/master/AMD.md)

##Bootstrap Pagination
Creation of dynamic navigation with use of Bootstrap Pagination
###Example
-------------------------------------------
```html
<div id="panel"></div>
<script src="pagination.js"></script>
<script>
Pagination({tag: '#panel'}).onclick(function (page) {
    alert(page);
});
</script>
```
###Result
-------------------------------------------
![Pagination](https://raw.githubusercontent.com/Poznakomlus/pagination/master/pagination.png)

[Download all example](https://github.com/Poznakomlus/pagination/archive/master.zip)
