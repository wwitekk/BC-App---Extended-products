# BC-App - Extended products

In case if 3 standard custom fields are not enough.

## Installing

### 1. Installing webapp (backend)
Repository content goes to: \_System\apps\ue-chris-Extended-Products\

In /_assets/js/app.js file > method: getXMLCataloguesList() set your Site Id. This value can be found in BC > Site Settings > API Integration

### 2. Reading new custom fields (frontend):
Products details page (\Layouts\OnlineShop\large_product.html)

At the top of the page enter Liquid code:
```
{module_json json="products.json" render="collection" collection="extended" template=""}
{% for item in extended.products %}
	{% if item.id == globals.get.ProductID -%}
		{% assign product = item %}
	{% endif -%}
{% endfor %}
```

Use tags: `{{product.custom4}}, {{product.custom5}}, {{product.custom5}}` in your code.

##Note
That was not used in production. Need:
- Code cleaning
- Tests, tests, tests
- Any info: issues, bugs, suggestions - welcome
