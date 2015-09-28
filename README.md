# BC-App---Extended-products

In case if 3 standard custom fields are not enough

## Installing

### 1. Installing webapp (backend)
Repository content goes to: \_System\apps\ue-chris-Extended-Products\

In Index.html method: getXMLCataloguesList() set your Site Id. This value can be found in BC > Site Settings > API Integration

### 2. Reading new custom fields (frontend):
Products details page (\Layouts\OnlineShop\large_product.html)

At the top of the page enter Liquid code:
```{module_json json="products.json" render="collection" collection="extended" template=""}
{% for item in extended.products %}
	{% if item.id == globals.get.ProductID -%}
		{% assign ep = item %}
	{% endif -%}
{% endfor %}```

Use tags: `{{ep.custom4}}, {{ep.custom5}}, {{ep.custom5}}` in your code.
