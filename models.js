var crypto = require('crypto'),
    User,
    LoginToken,
    Document;


function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
  /**
    * Model: UserStats -- Holds the holes
    */
UserStats = new Schema({
'user_id' : ObjectId,
'antecedent' : ObjectId,//The object that is 1 unit older than this object
'age' : Number,
'TotalActualScore' : Number,
'ScoreToPar' : Number,
'Holes' : Number,
'UnderParRounds' : Number,
'AverageScore': Number,
'Sub73Rounds': Number,
'RoundsPlayed' : Number,
'greenInside15' : Number,
'gNoChance' : Number,
'gAndFairway' : Number,
'gAndMissFairway' : Number,
'numMissFairway' : Number,
'wAndGreenInside15' : Number,
'numPosGreenInside15' : Number,
'numGoGreenInside15' : Number,
'goAndNoChance' : Number,
'numUpDownSuccess' : Number,
'numBounceBack' :Number,
'numpar5' : Number,
'par5scoretopar' : Number,
'par5score' :Number,
'Par5ScoringAvg' : Number,
'numpar4' : Number,
'par4scoretopar' : Number,
'par4score' : Number,
'Par4ScoringAvg' : Number,
'numpar3' : Number,
'par3scoretopar' : Number,
'par3score' : Number,
'Par3ScoringAvg' : Number,
'totalGreens' : Number, 
'BirdieConversionPct' : Number,
'NumBirdies' : Number,
'BounceBackPct' : Number,
'Total4and5DrivesToFairway' : Number,
'PctDrivingAccuracy' : Number,
'ScoreAfterHittingFairway' : Number,
'parAfterHittingFairway' : Number,
'tempScoreAfterHittingFairway' :Number,
'ScoreAfterMissingFairway' : Number,
'parAfterMissingFairway' : Number,
'tempScoreAfterMissingFairway' :Number,
'PctGreenInReg' : Number,
'PctInside15ft' : Number,
'PctNoChance' : Number,
'PctGreensHitAfterHitFairway' : Number,
'PctGreensHitAfterMissFairway' : Number,
'wedgeAttempts' : Number,
'wedgeGreensHit' : Number,
'wedgePctInside15ft' : Number,
'wedgePctBirdieConversion' : Number,
'wedgeNumBirdies' : Number,
'numGoPosition' : Number,
'posPctGreensInReg' : Number,
'posGreensHit' : Number,
'numPosHoles' : Number,
'posPctInside15ft' : Number,
'posPctBirdieConversion' : Number,
'posNumBirdies' : Number,
'posPctEagleConversion' : Number,
'posNumEagles' : Number,
'goPctGreensInReg' : Number,
'goGreensHit' : Number,
'numGoHoles' : Number,
'goPctNoChance' : Number,
'numGoNoChance' : Number,
'goPctInside15ft' : Number,
'goPctBirdieConversion' : Number,
'goNumBirdies' : Number,
'goPctEagleConversion' : Number,
'goNumEagles' : Number,
'upDownPct' : Number,
'upDownPctInside5ft' : Number,
'upDownPctScrambling' : Number,
'upDownOpportunities' : Number,
'sandPct' : Number,
'sandPctInside5ft' : Number,
'sandTotalOpportunities' : Number,
'puttPerRound' : Number,
'puttAverage' : Number,
'putt3PerRound' : Number,
'puttingPar' : Number,
'numUpDownInside5': Number,
'numEqualOrUnderPar': Number,
'numBogies': Number,
'numMissedGreenNoUpDown': Number,
'numBunkerSaves': Number,
'numBunkerInside5': Number,
'totalPutts': Number,
'num3plusPutts': Number
});
    UserStats.virtual('id')
        .get(function() {
            return this._id.toHexString();
        });
  /**
    * Model: Document
    */
  Document = new Schema({
    'title': { type: String, index: true },
    'data': String,
    'tags': [String],
    'keywords': [String],
    'user_id': ObjectId
  });

  Document.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  Document.pre('save', function(next) {
    this.keywords = extractKeywords(this.data);
    next();
  });
  /**
    * Model: Team  
    */
    Team = new Schema({
	'team_name' : String,
	'team_description' : String,
	'status' : String,
	'members' : [ObjectId]
    });
    Team.virtual('id')
	.get(function() {
	    return this._id.toHexString();
	});
  /**
    * Model: Visible
    */
Visible = new Schema({
'userid' : ObjectId,
'graphs' : [ObjectId]
});
Visible.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });
  /**
    * Model: Graph
    */
Graph = new Schema({
'values' : [String],
'type' : String
});
Graph.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  /**
    * Model: GameHoles
    */
GameHole = new Schema({
'gameid' : ObjectId, //data
'userid' : ObjectId, //code
'holeid' : ObjectId, //code
'par': Number,
'holenum' : String, //code
'holescore' : Number, //form
'fairway' : String, //form
'goposition' : String, //form
'wedgedist' : String, //form
'greeninout' : String, //form
'where_on_green' : String, //form
'gbound' : String, //form
'gleft' : String,
'gright' : String,
'gshort' : String,
'gover' : String,
'gnochance' : String,
'putts' : Number, //form
'updownsuccess' : String, //form
'updownnochip' : String, //form
'updownbound' : String,
'updown_bunker' : String, //form
'updown_inside_5' : String, //form
'score_to_par': Number, //code
'ph_score_to_par' : Number
});
  GameHole.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });
  /**
    * Model: Game 
    */
Game = new Schema({
'user_id': ObjectId, //in code /
'course_id': ObjectId, //in code /
'game_type': String, //in form /
'game_date': Date, //in form /
'total_score': Number, // after holes //Sum holescore
'adjusted_score': Number, // after holes // 
'holes_played': Number, //in form / 
'game_completed': String, //after holes // Set "True"
'total_score_to_par': Number, //after holes //sum (score_to_par)
'average_score': Number // after holes //total score / total par

});
 Game.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });
  /**
    * Model: CourseHole
    */
    CourseHole = new Schema({
	'course_id': ObjectId,
	'hole_num' : { type: String, index: true },
	'hole_par' : Number,
	'status' : String,
	'activity date' : String
    });
    CourseHole.virtual('id')
	.get(function() {
	    return this._id.toHexString();
	});
  /**
    * Model: Course -- Holds the holes
    */
Course = new Schema({
'course_name' : String,
'number_of_holes' : Number,
'course_description' : String,
'course_location' : String,
'green_type' : String,
'has_pic': String,
'pic_location': String,
'status' : String,
'par_total' : Number
});
    Course.virtual('id')
        .get(function() {
            return this._id.toHexString();
        });
  /**
    * Model: User -- User is combined with credentials.
    */
  function validatePresenceOf(value) {
    return value && value.length;
  }

  User = new Schema({
    'email': { type: String, validate: [validatePresenceOf, 'an email is required'], index: { unique: true } },//
    'last_name' : String,//
    'first_name' : String,//
    'displayname' : String,//
    'user_type' : String,//
    'phone' : String,//
    'status' : String,
    'activityDate' : String,
    'failedAttempts' : String,
    'account_lock' : String,
    'hint' : String,//
    'hashed_password': String,
    'salt': String
  });

  User.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  User.virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password; });

  User.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  });
  
  User.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  User.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  });

  User.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });

  /**
    * Model: LoginToken
    *
    * Used for session persistence.
    */
  LoginToken = new Schema({
    email: { type: String, index: true },
    series: { type: String, index: true },
    token: { type: String, index: true }
  });

  LoginToken.method('randomToken', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  LoginToken.pre('save', function(next) {
    // Automatically create the tokens
    this.token = this.randomToken();

    if (this.isNew)
      this.series = this.randomToken();

    next();
  });

  LoginToken.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  LoginToken.virtual('cookieValue')
    .get(function() {
      return JSON.stringify({ email: this.email, token: this.token, series: this.series });
    });
  mongoose.model('UserStats',UserStats);
  mongoose.model('Graph', Graph);
  mongoose.model('Visible', Visible);
  mongoose.model('Document', Document);
  mongoose.model('User', User);
  mongoose.model('LoginToken', LoginToken);
  mongoose.model('Team', Team);
  mongoose.model('GameHole', GameHole);
  mongoose.model('Game', Game);
  mongoose.model('CourseHole', CourseHole);
  mongoose.model('Course', Course);
  fn();
}

exports.defineModels = defineModels; 

