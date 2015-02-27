var crypto = require('crypto'),
    User,
    LoginToken,
    Page,
    Entry;
    


function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
 /**                                                                           
    * Model: Document                                                           
    */
  Entry = new Schema({
      'label':String,
      'content':String,
        'link':String,
        'linkdesc':String,
        'type':String
  });

  Entry.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });
  Page = new Schema({
      'owner':ObjectId,
      'shortname':String,
      'path':String,
      'title':String,
      'entries':[Entry]

});
Page.virtual('id')
.get(function(){
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
    'shortname': {type:String, validate:[validatePresenceOf, 'a shortname is required'], index: {unique:true}},
    'last_name' : String,//
    'first_name' : String,//
    'displayname' : String,//
    'joinDate' : {type: Date, default: Date.now},
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
  mongoose.model('Entry', Entry);
  mongoose.model('User', User);
  mongoose.model('LoginToken', LoginToken);
  mongoose.model('Page',Page);
  fn();
}

exports.defineModels = defineModels; 

