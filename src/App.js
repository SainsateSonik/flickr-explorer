import React, { Component } from 'react';
import { connect } from "react-redux";
import axios from "axios";
import './App.css';

import Nav from "./components/Nav/Nav";
import Gallery from "./components/Gallery/Gallery";
import Spinner from "./components/Spinner/Spinner";
import Modal from "./components/Modal/Modal";
import * as actionTypes from "./store/ActionTypes/actionTypes";
import storageKey from "./static/localStorageKey";

class App extends Component {
  constructor(props) {
    super(props);
    this.timer = null;      // Timer variable handles the call to the Flickr API
    this.pagination = 1;    // Current page that shall be retrieved from Flicker API on scrolling down
  }

  componentWillMount() {
    // Setting up Local Storage
    //  - key: context  |  set to an empty array
    if (!localStorage.getItem(storageKey))
      localStorage.setItem(storageKey, JSON.stringify([]));
  }

  componentDidMount() {
    // Attaching event listener to scrolling down the age
    window.addEventListener("scroll", () => {
      const loader = document.getElementById("loader-wrapper");
      if(loader) loader.style.opacity = 0;

      const scrollThreshold = document.documentElement.scrollHeight - window.innerHeight - 1;
      
      if(!this.props.isLastPage && window.scrollY > scrollThreshold  && loader) {
        loader.style.opacity = 1;
        ++this.pagination;

        // function fetchPhotos, receives 2 arguments
        //  - isContextNew  : false       | more data is requested from API with same search context and displayed to client
        //  - pageNumber    : pagination  | next page is requested for newer data.
        this.fetchPhotos(false, this.pagination);
      } else if (this.props.isLastPage && loader) {
        loader.style.opacity = 1;
      }
    });
  }

  inputChangeHandler = (e) => {
    this.props.inputHandler(e.target.value);
    
    // function fetchPhotos, receives 2 arguments
    //  - isContextNew  : true  | new set of data is requested from API and displayed to client
    //  - pageNumber    : N/A   | this parameter has default value of 1, so it fetches first page data. 
    this.fetchPhotos(true);
  }

  // This method is called to get the data from API on:
  //  - adding search content provided as input, or
  //  - by scrolling down
  fetchPhotos = (isContextNew, pageNumber=1) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      axios.get(
        'https://api.flickr.com/services/rest/',
        {
          // setting query parameters of the end-point
          params: {
            method: 'flickr.photos.search',
            api_key: 'aaf9fb186997ad7b9bcc5b8101b729b2',
            text: this.props.searchContext,
            per_page: 20,
            page: pageNumber,
            format: 'json'
          }
        }
      )
        .then(res => {
          const { data } = res;

          // JS Object created from the JSON data recieved
          const jsonData = JSON.parse(("" + data).substring(14, ("" + data).length - 1));
          console.log(jsonData);
          if(jsonData.stat === "ok") {
            
            this.handleLocalStorage(isContextNew);

            // fetch the URL of the photos to be diplayed in UI
            const photoURLs = jsonData.photos.photo.map(photo => {
              const { farm, server, id, secret, title } = photo;
              return {
                id,
                title,
                url: `http://farm${farm}.staticflickr.com/${server}/${id}_${secret}_n.jpg`, 
              };
            });

            const isLastPage = jsonData.photos.page === jsonData.photos.pages;
            // Add photos URL to the store
            this.props.addPhotos(photoURLs, isLastPage, isContextNew);
          }
        })
        .catch(er => console.log(er));
    }, 500);
  }

  handleLocalStorage = (isContextNew) => {
    if(isContextNew) {
      const localData = JSON.parse(localStorage.getItem(storageKey));
      if(localData.length === 10)
        localData.pop();
      const context = this.props.searchContext.toLowerCase().trim();
      if (!localData.includes(context)) {
        localData.unshift(context);
        localStorage.setItem(storageKey, JSON.stringify(localData));
      }
    }
  }

  render() {
    const { modalPhoto, loading } = this.props;
    return (
      <div className="App">
        <Nav  searchContext={this.props.searchContext}
              inputChangeHandler={this.inputChangeHandler}/>
        { modalPhoto ?
          <Modal  photo={modalPhoto}
                  collapsePhoto={this.props.collapsePhoto}/> :
          null
        }
        { loading ? 
            <Spinner /> :
            <Gallery  searchContext={this.props.searchContext}
                      photosURL={this.props.photosURL}
                      enlargePhoto={this.props.enlargePhoto}
                      isLastPage={this.props.isLastPage}/>
        }
      </div>
    );
  }
}

// REDUX state mapping
const mapStateToProps = state => ({ ...state });

// REDUX dispatch methods mapping
const mapDispatchToProps = dispatch => ({
  inputHandler: value => dispatch({ type: actionTypes.HANDLE_INPUT_CHANGE, value }),
  addPhotos: (photos, isLastPage, isContextNew) => dispatch({ type: actionTypes.ADD_PHOTOS_URL, photos, isLastPage, isContextNew }),
  enlargePhoto: photo => dispatch({ type: actionTypes.ENLARGE_PHOTO, photo }),
  collapsePhoto: () => dispatch({type: actionTypes.ENLARGE_PHOTO, photo: null })
})

export default connect(mapStateToProps, mapDispatchToProps)(App);