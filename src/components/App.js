import React from 'react';
import youtube from '../apis/youtube';

import './styles/App.css';
import Ad from './Ad';
import SearchBar from './SearchBar';
import VideoDetail from './VideoDetail';
import VideoList from './VideoList';
import { connect } from "react-redux";
import {
    searchTerm,
    getComments,
    getVideoDetails,
    selectCurrentVideo,
    getChannelInfo,
    getViewCountList,
} from '../actions';


class App extends React.Component {

    state = { 
        selectedVideo: null,
        videoDetails: [],
        comments: [],
        viewCounts: [],
        subscriberCount: 0,
    };

    onVideoSelect = async (video) => {
        const response2 = await youtube.get('/commentThreads', {
            params:{
                part: 'snippet,replies',
                videoId: video.id.videoId,
                order: 'relevance'
            }
        });
        const response3 = await youtube.get('/videos', {
            params:{
                id: video.id.videoId,
                part: 'snippet,statistics'
            }
        });
        const response4 = await youtube.get('/channels', {
            params:{
                id: video.snippet.channelId,
                part: 'statistics'
            }
        });
        this.setState({ selectedVideo: video , comments: response2.data.items, videoDetails: response3.data.items[0], subscriberCount: response4.data.items[0].statistics.subscriberCount});    
    };

    render(){
        return (
            <div className='globalFont'>
                <SearchBar/>

                <div className='ui stackable grid'>
                    <div className='ui row'>
                    
                        <div className='ten wide column left-place-holder'>
                            <VideoDetail 
                                comments={this.state.comments}
                                video={this.state.selectedVideo}  
                                videoDetails={this.state.videoDetails} 
                            />
                        </div>

                        <div className='four wide column'>
                            <Ad />
                            <VideoList />
                        </div>

                    </div>    
                </div>  
                  
            </div>
        )
    };
};

const mapStateToProps = state => {
    return{
        videos: state.videos
    }
}

export default connect(mapStateToProps, {searchTerm, getComments, getVideoDetails, selectCurrentVideo, getChannelInfo, getViewCountList})(App);