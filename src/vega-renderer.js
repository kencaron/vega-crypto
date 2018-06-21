import { h, Component } from "preact";
import PropTypes from "prop-types";
import * as vega from "vega";

/**
 * Based on renderer.js from vega-editor.
 */
export default class VegaRenderer extends Component {
  static propTypes = {
    vegaSpec: PropTypes.object,
    renderer: PropTypes.string
  };

  renderVega(props) {
    console.log("rendering vega");
    let runtime;
    let view;
    try {
      runtime = vega.parse(props.vegaSpec);
      view = new vega.View(runtime)
        .logLevel(vega.Warn)
        .initialize(this.chart)
        .renderer(props.renderer);

      view.hover();
      view.run();
    } catch (err) {
      throw err;
    }
    this.chart.style.width = "100%";
  }

  componentDidMount() {
    this.renderVega(this.props);
  }

  componentDidUpdate() {
    console.log("UPDATE");
    this.renderVega(this.props);
  }

  renderChart() {
    return (
      <div className="chart-container">
        <div className="chart">
          <div
            ref={c => {
              this.chart = c;
            }}
          />
        </div>
      </div>
    );
  }

  render() {
    return this.renderChart();
  }
}
