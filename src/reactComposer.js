import {Component, createElement} from 'react';
import utils from './utils';
import Store from './store';

function cb(container, name, payload) {
    if (name) {
        container.setState(state => {
            let res = {...state};
            res[name] = payload;
            return res;
        });
    }
    else {
        container.setState(state => {
            return {...state, ...payload};
        });
    }
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export default function (composer, decomposer, properties, onEnter, mapData) {
  return function wrap(UIComponent) {
    return class extends Component {
      constructor(props) {
        super(props);
        this.id = makeid();
      }

      componentDidMount() {
        composer(cb.bind(null, this), this.id);
        if (onEnter && utils.isFunction(onEnter)) {
            onEnter(this.props);
        }
      }

      componentWillUnmount() {
        decomposer(this.id);
      }

      render() {
        const props = {...mapData(Store), ...this.state, ...this.props, ...properties};
        return createElement(
          UIComponent,
          props,
        );
      }
    };
  }
}
