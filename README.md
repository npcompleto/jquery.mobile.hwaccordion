jquery.mobile.hwaccordion
=========================

Smooth 3D Animated accordion implemented as a JQM widget.

**DOM structure:**

* Accordion
	* Element
		* Header
		* Content

Example:

```html
<div data-role="hwaccordion">
		<div data-role="accordion-element">
			<div data-role="accordion-header">
				<span>Element 1</span>
			</div>
			<div data-role="accordion-content">
				<p>Content 1</p>
			</div>
		</div>
		
		<div data-role="accordion-element">
			<div data-role="accordion-header">
				<span>Element 2</span>
			</div>
			<div data-role="accordion-content">
				<p>Content 2</p>
			</div>
		</div>
</div> 
```

**Options**
-

**Auto-scrolling**

On opening accordion will scroll  to show its content.

```html
<div data-role="hwaccordion" data-auto-scroll="true">
```

**Disable inputs on close**

All the input fields inside a closed accordion content will be disabled.

```html
<div data-role="hwaccordion" data-disable-input-on-close="true">
```

**Radio Mode**

Only one accordion element at a time will be opened.

```html
<div data-role="hwaccordion" data-radio-mode="true">
```

**Icons**

```html
<div id="accordion1" data-role="hwaccordion" data-icon-opened="arrow-u" data-icon-closed="arrow-d">
```


**Methods**
-

**Open**

hwaccordion("open", _accordionIndex_) opens an accordion element with index _accordionIndex_ 

```javascript
$('#accordion1').hwaccordion("open",0);
```

**Close**

hwaccordion("close", _accordionIndex_) closes an accordion element with index _accordionIndex_ 

```javascript
$('#accordion1').hwaccordion("close",0);
```
