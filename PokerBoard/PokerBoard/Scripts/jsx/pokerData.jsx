

var ROOM_ID = $("#RoomID").val();
var roomInfo = " /poker/roomInfo/" + ROOM_ID;

var StorySection = React.createClass({
    handleClick(event) {
        if (this.props.isModerator){
            this.props.onStoryChange(this.props.tabindex);
        }
    },
    render: function () {
        return (
            <li className="list-group-item">
            <div className="row" onClick={this.handleClick}>
                <div className="col-md-8">{this.props.story.storyName}</div>
                <div className="col-md-4">{this.props.story.finalValue}</div>
                
            </div>
            </li>
        );
    }
});


var ModeratorLogIn = React.createClass({
    getInitialState: function() {
        return { value: '' };
    },
    handleChange(event) {
        this.setState({value: event.target.value});
    },
    handleSubmit(event) {
        this.props.onLogIn(this.state.value);
        this.setState({ value: "" });
        event.preventDefault();
    },
    render: function () {
        var classString = "card";
        //var classString = this.props.isActive ? "card Active" : "card";
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Password:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
}
});
var EditableCard = React.createClass({
    getInitialState: function () {
        return { value: this.props.cardValue };
    },
    componentDidUpdate(prevProps, prevState) {
        // only update value if the data has changed
        if (prevProps.cardValue !== this.props.cardValue) {
            this.setState({ value: this.props.cardValue });
        }
    },
    handleChange(event) {
        this.setState({ value: event.target.value });
    },
    handleClick(event){

        var clickType = event.currentTarget.getAttribute("data-type");
        if(clickType == "Add"){
            this.props.onInsert(this.props.index);
        } else {
            this.props.onDelete(this.props.index);
        }
    },

    render: function () {
        var id = "EditCards_" + this.props.index;
        return (
            <div id={id} className="input-group">
                <input type="text" value={this.state.value} className="EditCardInput form-control" onChange={this.handleChange} />
                <div onClick={this.handleClick} data-type="Add" data-value={this.props.index } className="input-group-addon add">+</div>
                <div onClick={this.handleClick} data-type="Delete" data-value={this.props.index }  className="input-group-addon delete">X</div>
            </div>
        );
    }

});
var ModeratorSection = React.createClass({
    handleClick(event) {
        var changeType = event.currentTarget.getAttribute("data-change-type");
        if (changeType == "roomState") {
            this.props.onRoomStateChange(event.currentTarget.getAttribute("data-value"));
        } else if (changeType == "reset") {
            this.props.onReset();
        } else if (changeType == "finalizeVote") {
            this.props.finalizeVote();
        } else if (changeType == "updateCards") {
            var cards = Array.prototype.slice.call(event.target.parentNode.parentNode.querySelectorAll("form .EditCardInput")).map(function (entry) {
                return entry.value;
            });
            var updateAll = event.target.parentNode.parentNode.querySelector("#UpdateAllCards").checked;
            this.props.onCardUpdate(updateAll, cards);
            event.target.parentElement.parentElement.parentElement.classList.remove("in");
        }
    },
    addCard: function (index) {
        this.props.cards.splice(index, 0, "");
        this.forceUpdate();
    },
    removeCard: function (index) {
        this.props.cards.splice(index, 1);
        this.forceUpdate();
    },
    render: function () {
        var self = this;
        var CardForm = this.props.cards.map(function (cardVal, index) {
            return (<EditableCard cardValue={cardVal} index={index} onInsert={self.addCard} onDelete={self.removeCard }/>);
        });
        return (
            <div className="row">
                <div className="btn-group">
                    <div className="btn btn-primary" onClick={this.handleClick} data-change-type="reset" data-value="0">
                            Reset Board
                    </div> 
                    <div className="btn btn-primary" onClick={this.handleClick} data-change-type="roomState" data-value="-1">
                        Disable Voting
                    </div>
                    <div className="btn btn-primary" onClick={this.handleClick} data-change-type="roomState" data-value="0">
                        Open Voting
                    </div>
                    <div className="btn btn-primary" onClick={this.handleClick} data-change-type="roomState" data-value="1">
                        Show Results
                    </div>
                    <div className="btn btn-primary" onClick={this.handleClick} data-change-type="finalizeVote" data-value="1">
                        Finalize Result
                    </div>
                    <div className="btn btn-primary" data-toggle="collapse" data-target="#EditCards">
                        Edit Cards
                    </div>

                    <div className="btn btn-primary" onClick={this.handleClick} data-change-type="editRoom" data-value="1">
                        Edit Stories
                    </div>
                </div>
                
                    <div id="EditCards" className="collapse">
                        <div className="col-md-6">
                            <form id="EditCardForm">
                                <div className="col-md-12">
                                    {CardForm}
                                <input type="checkbox" id="UpdateAllCards" name="updateAllCheckbox" />
                                <label form="updateAllCheckbox">Apply changes to all stories.</label>
                                </div>
                            </form>
                            <div className="col-md-12">
                                <div className="btn btn-primary" onClick={this.handleClick} data-change-type="updateCards" data-value="1">
                                    Save Cards
                                </div>
                            </div>
                        </div>

                    </div>
            </div>
        );
    }
});


var Card = React.createClass({
    getInitialState: function () {
        return {
            condition: false
        }
    },
    handleClick: function () {
        if (this.props.boardState == 0) {
            this.props.onVoteSelect(this.props.choice);
            this.setState({ condition: !this.props.condition });
        }
    },
    render: function () {
        var classString = this.props.isActive ? "card Active" : "card";
        var disabled = this.props.boardState == -1 ? " disable" : "";
        classString += disabled;
        return (
            <div className="col-md-3 col-xs-3">
                <div className={classString } onClick={this.handleClick }>
                    <div className="centerChoice">{this.props.choice}</div>
                </div>
            </div>
            );
    }
});

var UserInfo = React.createClass({
    getInitialState: function () {
        return {}
    },
    render: function () {
        var moderatorIdentification = this.props.user.isModerator ? "true" : "false";
        var classString = moderatorIdentification ? "User_info moderator" : "User_info";
        return (
            <div className={classString}>
                <div className="Name">{this.props.user.name}
                </div>
                <div className="Vote">{this.props.user.vote}
                </div>
            </div>
            );
    }
});
var PokerContainer = React.createClass({
    getInitialState: function () {
        console.log("GetInitialState");
        return {
            room_info: { roomUsers: [], currentStory: { cards: [] }, roomMessage: "", Stories: [] },
            user: {isModerator: false}
        }
    },
    componentDidMount: function () {
        var self = this;
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                this.setState({
                    room_info: data,
                    user_choice: "",
                    previous_choice: "",
                    is_done: false,
                    selectedTabId: 1
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        var pokerhub = $.connection.pokerHub;
        $.connection.hub.start().done(function () {
            pokerhub.server.connect(ROOM_ID);
        });

        pokerhub.client.onPageUpdate = function (data) {
            var parsedData = JSON.parse(data);
            self.setState({ room_info: parsedData });
        }

        pokerhub.client.selfUpdate = function (userData) {
            var parsedData = JSON.parse(userData);
            self.setState({ user: parsedData });

        }

        pokerhub.client.onSendError = function (message) {
            self.setState({ error: message });

        }
        pokerhub.client.onClearVotes = function(){
            var userData = self.state.user;
            userData.vote = null;
            userData.prevVote = null;
            self.setState({user: userData})
        }

    },
    moderatorPassword: function(password){

        var pokerhub = $.connection.pokerHub;
        $.connection.hub.start().done(function () {
            // Call the Send method on the hub.
            pokerhub.server.becomeAModerator(password, ROOM_ID);
        });
    },
    selectedVote: function(option) {

        var pokerhub = $.connection.pokerHub;
        $.connection.hub.start().done(function () {
            // Call the Send method on the hub.
            pokerhub.server.send(ROOM_ID, option);
        });
    },
    isActive: function (id) {
        return this.state.user.vote === id;
    },
    updateRoomState: function (state) {
        var pokerhub = $.connection.pokerHub;
        $.connection.hub.start().done(function () {
            // Call the Send method on the hub.
            pokerhub.server.updateRoomState(state, ROOM_ID);
        });
    },
    resetBoard: function (state) {
        var pokerhub = $.connection.pokerHub;
        $.connection.hub.start().done(function () {
            // Call the Send method on the hub.
            pokerhub.server.resetVoting(ROOM_ID);
        });
    },
    finalizeVote: function(){
        var pokerhub = $.connection.pokerHub;
        $.connection.hub.start().done(function () {
            // Call the Send method on the hub.
            pokerhub.server.finalizeVote(ROOM_ID);
        });
    },
    changeStory: function (val) {
        var self = this;
        var pokerhub = $.connection.pokerHub;
        $.connection.hub.start().done(function () {
            var story = self.state.room_info.Stories[val];
            // Call the Send method on the hub.
            pokerhub.server.storyChange(ROOM_ID, story);
        });
    },
    updateCards: function (updateAll, cards) {
        var pokerhub = $.connection.pokerHub;
        $.connection.hub.start().done(function () {
            // Call the Send method on the hub.
            pokerhub.server.updateCards(updateAll, cards, ROOM_ID);
        });
    },
    render: function () {
        var self = this;
        var button_name = "Submit";
        var name = "empty";
        var choices = "empty";
        var id = "empty";
        if (this.state.user != null) {
            id = self.state.id;
            name = self.state.user;
            choices = self.state.room_info;
        }
        var users = this.state.room_info.roomUsers.map(function (user, index) {
            return (
                <UserInfo user={user}
                      index={index
}
                       />
                );
});
        var votes = this.state.room_info.currentStory.poll;

        var roomState = this.state.room_info.roomState;
        var cards = this.state.room_info.currentStory.cards.map(function (choice, index) {
            return (
                <Card choice={choice}
                        onVoteSelect={self.selectedVote}
                        index={index}
                        isActive={ self.isActive(choice) }
                        boardState={roomState}
                       />
                );
        });
        var isModerator = false;
        var listOfCards = this.state.room_info.currentStory.cards;
        var moderatorSection = <ModeratorLogIn onLogIn={self.moderatorPassword }/>;
        if (this.state.user.isModerator) {
            isModerator = true;
            moderatorSection = <ModeratorSection onRoomStateChange={self.updateRoomState}
                                                 onReset={self.resetBoard} 
                                                 finalizeVote={self.finalizeVote}
                                                 onCardUpdate={self.updateCards}
                                                 cards={listOfCards}
                                />;
        }

        var stories = this.state.room_info.Stories.map(function (choice, index) {
            return (
                <StorySection story={choice} tabindex={index} onStoryChange={self.changeStory } isModerator={isModerator} />
                );
        });
       // var classString = this.state.allVotesIn ? "quizContainer hidden" : "quizContainer";
        return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 text-center">
                    {moderatorSection}
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 text-center">
                    <h2>{this.state.room_info.currentStory.storyName}</h2>
                </div>
            </div>
            <div className="row" data-toggle="buttons">
                <div className="col-md-12">
                    
                    <div className="col-md-2">
                        <ul className="list-group">
                            {stories}
                        </ul>
                        
                    </div>
                    <div className="col-md-8">
                        {cards}
                    </div>
                    <div className="col-md-2">
                        {users}
                    </div>
                </div>
            </div>
            <div className="row">
                {votes}
            </div>
            <div className="row">
                {self.state.room_info.roomMessage}
                </div>
        </div>
            );
}
});



React.render(
    <PokerContainer url={roomInfo} />,
    document.getElementById('PokerContainer')
);