# selector

make html elements option for select

<hr>

#### import
``` html
<script type = 'module'>
import iRating from './selector.js'
customElements.define('t-select', iRating)
</script>
```

### example
``` html
<t-select select = food>
<span opt = food value = 'pizza'> pizza </span>
<span opt = food value = 'checken'> chicken </span>
</t-select>

<style>
t-select span[selected] {
  color:red
}
</style>
```

#### method


#### attribute
- value : selected option value
- onselect : event function when selection event
