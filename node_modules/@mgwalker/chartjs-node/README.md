[![snapshot test status badge](https://github.com/mgwalker/chartjs-node/actions/workflows/test.yaml/badge.svg)](https://github.com/mgwalker/chartjs-node/actions/workflows/test.yaml)

# Chart.js-node

Build static [Chart.js](https://www.chartjs.org) 3.x charts in Node. It's a lot
like using Chart.js directly, but with a few tweaks.

### Getting started

```shell
npm install @mgwalker/chartjs-node
```

And then to use it:

```javascript
import Chart from "chartjs-node";

const myChart = new Chart([width, height], config);
```

The `config` option is a complete [Chart.js configuration](https://www.chartjs.org/docs/latest/configuration/)
object, including datasets, options, etc. Note that `options.animations` is
always set to `false` since the rendered image is static.

chartjs-node includes [chartjs-adapter-luxon](https://github.com/chartjs/chartjs-adapter-luxon),
[chartjs-plugin-annotation](https://github.com/chartjs/chartjs-plugin-annotation), and
[chartjs-plugin-datalabels](https://github.com/chartjs/chartjs-plugin-datalabels),
so you can also use any configuration for those. Please note that the datalabels
plugin is disabled unless you provide configuration for it.

> Other plugins are not included because they don't work with Chart.js 3.x.

The `config` can also include some options that are specific to chartjs-node:

| path                      | description                                                                                        | default |
| ------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| `deviceScaleFactor`       | When rendering the image, what device scale factor to use. Set larger to get clearer antialiasing. | 1       |
| `options.backgroundColor` | The background color of the generated chart.                                                       | `white` |

To save your chart:

```javascript
await myChart.save([path]);
```

If `path` is provided, the chart will be saved as a PNG to the provided path. If
`path` is omitted, `save()` will resolve with a buffer containing the PNG.
