import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ContextMenuProvider } from './Components/ContextMenu/ContextMenu';

import store from './Redux/_store/store';
import LoggingRouter from './Screens/LoggingRouter';
import './SCSS/react-contextmenu.css';

document.body.style.overflow = 'hidden';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ContextMenuProvider>
          <LoggingRouter />
          <ToastContainer
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ContextMenuProvider>
      </Provider>
    );
  }
}

export default App;
