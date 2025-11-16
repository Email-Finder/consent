# A simple Consent drop-in script

## Usage
**Step 1 Just include the script in your head**

```
<script src="consent.js"></script>
```

**Step 2 modify (or add) type and add data-category tag in your analytic scripts**
Before
```
<script type="text/javascript" src="gtag.js">
gtag('foo','bar');
</script>
```

After
```
<script type="text/plain" data-category="analytics"  src="gtag.js">
gtag('foo','bar');
</script>
```