var express          = require("express"),
	app              = express(),
	bodyParser       = require("body-parser"),
	mongoose         = require("mongoose"),
	flash            = require("connect-flash"),
	passport         = require("passport"),
	LocalStrategy    = require("passport-local"),
	methodOverride   = require("method-override"),
	Campground       = require("./models/campground"),
	Comment          = require("./models/comment"),
	User             = require("./models/user"),
	seedDB           = require("./seeds");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Snowden knows all the secrets",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");  
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

/*
Campground.create(    
	{
		name: "Granite Hill", 
		image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
		description: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"
	},
	function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			console.log("NEWLY CREATED CAMPGROUND: ");
			console.log(campground);
		}
	});
*/
/*
var campgrounds = [
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
];
*/

app.listen(3000, function() {
	console.log("The YelpCamp server has started!");
});