import { h, Component } from "preact";
import "./App.css";
import VegaRenderer from "./vega-renderer";
import barchart from "./barchart.json";
import currencies from "./currencies.json";

class App extends Component {
  currencies = currencies;
  barchart = barchart;

  constructor(props) {
    super(props);
    this.state = {
      currencies,
      barchart
    };
  }

  // Async for all currencies, maps over results and filters out unneeded data
  async getCurrencies() {
    const promises = this.currencies.map(currency =>
      this.getCurrency(currency.symbol)
    );

    const responses = await Promise.all(promises);
    return responses.map((response, index) => {
      return response.map(entry => {
        return {
          price: entry.open.toFixed(2),
          timestamp: entry.time * 1000
        };
      });
    });
  }

  // Fetch CryptoCompare data for a given currency symbol, as defined in currencies.json
  getCurrency(symbol) {
    return fetch(
      `https://min-api.cryptocompare.com/data/histominute?fsym=${symbol}&tsym=USD&limit=60`
    )
      .then(response => response.json())
      .then(json => json.Data);
  }

  //Reacts to button events and is called after initial componentDidMount
  //Sets our data to the right currency and sets the new state
  setCurrency(currency) {
    const indexOfCurrency = this.currencies.findIndex(
      c => c.name === currency.name
    );

    const updatedBarchart = {
      ...this.state.barchart,
      data: [
        {
          ...this.state.barchart.data[0],
          values: this.chartData ? this.chartData[indexOfCurrency] : null
        }
      ]
    };
    this.setState({
      barchart: updatedBarchart,
      currency
    });
  }

  //Makes our initial fetches needed for the first chart render
  componentDidMount() {
    this.getCurrencies().then(data => {
      this.chartData = data;
      this.setCurrency(this.currencies[0]);
    });
  }

  render() {
    return (
      <div className="App container">
        <div className="row">
          <div className="col">
            <div className="App-header">
              <h2>Simple Crypto Charts</h2>
            </div>
            <p>
              This is a snapshot of the last hour of 10 leading cryptocurrencies
              according to the{" "}
              <a
                target="_blank"
                href="https://data.bloomberglp.com/professional/sites/10/BGCI-Factsheet-6-4-18-FINAL2.pdf"
              >
                Bloomberg Galaxy Crypto Index (BGCI)
              </a>.
            </p>
            <p>
              This is a simple Preact app which uses the same API of React at a
              fraction of the size. It uses the CryptoCompare API and the chart
              itself is rendered through Vega, which is built by much of the
              same team behind D3.js.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <VegaRenderer vegaSpec={this.state.barchart} renderer="svg" />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div class="btn-group" role="group" aria-label="Basic example">
              {this.state.currencies.map(currency => (
                <button
                  type="button"
                  onClick={() => this.setCurrency(currency)}
                  className={`btn ${
                    this.state.currency === currency
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                >
                  {currency.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
