var vivek={}
vivek.irs=(function(){
    var canvas,context,themainshape,theoldContainer;
    var bodies=[];
    var spawnCircleCounter=0;
    var thevector=myChrome.Common.Math.b2Vec2,
	thebodydef=myChrome.Dynamics.b2BodyDef,
	thebody=myChrome.Dynamics.b2Body,
	thefixturedef=myChrome.Dynamics.b2FixtureDef,
	thefixure=myChrome.Dynamics.b2Fixture,
	theWorld=myChrome.Dynamics.b2World,
	theMassData=myChrome.Collision.Shapes.b2MassData,
	thePolygonShape=myChrome.Collision.Shapes.b2PolygonShape,
	theCircleShape=myChrome.Collision.Shapes.b2CircleShape,
     theMouseJointDef =  myChrome.Dynamics.Joints.b2MouseJointDef,
     b2AABB = myChrome.Collision.b2AABB
	thedebugDraw=myChrome.Dynamics.b2DebugDraw;
    
    //to be executed on page load
    window.onload=function(){
        stagesetup.setup();
        stagesetup.ticker();
        myphysics.setup();
    }
    
    var stagesetup=(function(){
        
        var setup=function(){
        canvas=document.getElementById("mycanvas");
        context=canvas.getContext("2d");
        debugCanvas = document.getElementById('debugCanvas');
        debugContext=debugCanvas.getContext("2d");
      
      
    
        stage=new Stage(canvas);
        stage.snapPixelsEnabled=true;
        stage.mouseEventsEnabled=true;
    
        themainshape=new Shape();
        var thecolorgraphics=new Graphics();
        thecolorgraphics.setStrokeStyle(1).beginStroke(Graphics.getRGB(0,0,0,1)).beginFill(Graphics.getRGB(33,33,33,1)).rect(0,0,960,900).endFill();
        themainshape.graphics=thecolorgraphics;
        
        
        /*
        themainshape.graphics.setStrokeStyle(1);
        themainshape.graphics.beginStroke(Graphics.getRGB(0,0,0,1));
        themainshape.graphics.beginFill(Graphics.getRGB(0,255,0,1));
        themainshape.graphics.rect(0,0,960,900);
        themainshape.graphics.endFill();*/
        stage.addChild(themainshape);
        
        var leftWallLine=new Graphics();
        leftWallLine.setStrokeStyle(1);
        leftWallLine.beginStroke(Graphics.getRGB(51,181,229));
        leftWallLine.beginFill(Graphics.getRGB(255,0,0));
        leftWallLine.moveTo(15,550).lineTo(15, 900);
        leftWallLine.moveTo(15,900).lineTo(315, 900);
        leftWallLine.moveTo(315,900).lineTo(315,550);
        var s = new Shape(leftWallLine);
        
        stage.addChild(s);
       
        
        };
        
    var ticker=function(){
        Ticker.setFPS(30);
        Ticker.useRAF=true;
        Ticker.addListener(vivek.irs);
        };
        
    var getElementPosition=function(element){
        var elem=element, tagname="", x=0, y=0;
           
            while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
               y += elem.offsetTop;
               x += elem.offsetLeft;
               tagname = elem.tagName.toUpperCase();

               if(tagname == "BODY")
                  elem=0;

               if(typeof(elem) == "object") {
                  if(typeof(elem.offsetParent) == "object")
                     elem = elem.offsetParent;
               }
            }

            return {x: x, y: y};
    }
       
    return{setup:setup,ticker:ticker,getElementPosition:getElementPosition};
        
    }());
    
    
        //the greatcircles object
    var theGreatCircles=(function(){
        var circleimg,cirBmp,color;
        var spawn=function(){
            var randInt=Math.floor(1 + Math.random() * 8);
            switch(randInt){
                case 1:
                circleimg="img/Template2.png";
                color="#c4e23a";
                break;
                case 2:
                circleimg="img/Template2B.png";
                color="#e2c43a";
                break;
                case 3:
                circleimg="img/Template2C.png";
                color="#b1a675";
                break;
                case 4:
                circleimg="img/Template2D.png";
                color="#adb345";
                break;
                case 5:
                circleimg="img/Template2E.png";
                color="#8bcdb8";
                break;
                case 6:
                circleimg="img/Template2F.png";
                color="#afa8f2";
                break;
                case 7:
                circleimg="img/Template2G.png";
                color="#9ccd8b";
                break;
                case 8:
                circleimg="img/Template2H.png";
                color="#cba8f2";
                break;
                    
            }
            var cirBmp=new Bitmap(circleimg);
            cirBmp.regX=40;
            cirBmp.regY=40;
            var andBmp=new Bitmap("img/logo.png");
            andBmp.regX=27;
            andBmp.regY=27;
            var container=new Container();
            container.addChild(cirBmp);
            container.addChild(andBmp);
            container.x=Math.round(20+Math.random()*180);
            //cirBmp.y=550;
            container.y=-3;
            
           	container.snapToPixel = true;
			container.mouseEnabled = true;
            container.setClickedstatus=false;
            container.greatColor=color;
            container.onPress=function(e){
                this.setClickedstatus=true;
                
                 
                
            }
            
            
            
            stage.addChild(container);
            
            
            myphysics.addBodies(container);
        }
         
        return{spawn:spawn};
        
    }());
    
    var myphysics=(function(){
        var actors=[];
        var mybody,world;
        var SCALE=30;
        var STEP = 20, TIMESTEP = 1/STEP;
        var bodiesToRemove=[];
        
        var setup=function(){
            world=new theWorld(new thevector(0,10),true);
            addDebug();
            //add floor
                //->first define fixture
                var floorfixture=new thefixturedef;
                floorfixture.density=1;
                floorfixture.restitution=0.5;
                floorfixture.shape=new thePolygonShape;
                floorfixture.shape.SetAsBox(422/SCALE,1/SCALE);
                //->then define body
                var floorbodydef=new thebodydef;
                floorbodydef.type=thebody.b2_staticBody;
                floorbodydef.position.x=437/SCALE;
                floorbodydef.position.y=899/SCALE;
                var floor=world.CreateBody(floorbodydef);
                floor.CreateFixture(floorfixture);
                
            //add left fixture
                //first define left fixture
                var leftfixture=new thefixturedef;
                leftfixture.density=1;
                leftfixture.restitution=0;
                leftfixture.shape=new thePolygonShape;
                leftfixture.shape.SetAsBox(1/SCALE,175/SCALE);
                //->then definebody
                var leftbodydef=new thebodydef;
                leftbodydef.type=thebody.b2_staticBody;
                leftbodydef.position.x=14/SCALE;
                leftbodydef.position.y=725/SCALE;
                var leftWall=world.CreateBody(leftbodydef);
                leftWall.CreateFixture(leftfixture);
                
                 //add right fixture
                //first define right fixture
                var rightfixture=new thefixturedef;
                rightfixture.density=1;
                rightfixture.restitution=0;
                rightfixture.shape=new thePolygonShape;
                rightfixture.shape.SetAsBox(1/SCALE,175/SCALE);
                //->then definebody
                var rightbodydef=new thebodydef;
                rightbodydef.type=thebody.b2_staticBody;
                rightbodydef.position.x=314/SCALE;
                rightbodydef.position.y=725/SCALE;
                var rightWall=world.CreateBody(rightbodydef);
                rightWall.CreateFixture(rightfixture);
                
        };
        
        var theactorObject=function(body,container){
            this.body=body;
            this.container=container;
            
            this.update=function(i){
                if(this.container.setClickedstatus==false){
                    
              this.container.rotation=this.body.GetAngle()*(180/Math.PI);
              this.container.x=this.body.GetWorldCenter().x*SCALE;
              this.container.y=this.body.GetWorldCenter().y*SCALE;
                this.container.rotation=this.body.GetAngle()*(180/Math.PI);
              
                            
              }else{
                
                actors.splice(i,1);
                bodies.splice(i,1);
               
                world.DestroyBody(this.body);
                var thegreatcontainer=this.container;
                var myGreatColor=this.container.greatColor;
                var thegreatlogo=this.container.getChildAt(1);
                if(theoldContainer!=null){
                        Tween.get(theoldContainer.getChildAt(1)).to({scaleX:1,scaleY:1},1000);
                        Tween.get(theoldContainer.getChildAt(0)).to({alpha:1});
                        Tween.get(theoldContainer).to({x:415,y:860},3000).wait(1000).to({x:940,y:860,rotation:360},3000).to({alpha:0});
                    }
                Tween.get(this.container).to({x:415,y:200,rotation:0}, 3000,Ease.bounceOut).call(function(){
                    
                   Tween.get(thegreatcontainer.getChildAt(0)).to({alpha:0},2000);
                    
                });
                theoldContainer=this.container;
                Tween.get(thegreatlogo).wait(3000).to({scaleX:3,scaleY:3},3000); 
                

              }
            };
            this.move=function(midx,midy,endx,endy){
                if(midy>this.skin.y){
                this.skin.x=this.skin.x+0.1;
                this.skin.y=this.skin.y-0.1;
                }else{
                    this.skin.y=this.skin.y+0.1;
                } 
            };
            actors.push(this);
            };
        
        var addBodies=function(container){
        
        
        var bodyfixturedef=new thefixturedef;
        bodyfixturedef.density=1;
        bodyfixturedef.restitution=0.5;
        bodyfixturedef.shape=new thePolygonShape;
        bodyfixturedef.shape.SetAsBox(40/SCALE,40/SCALE);
        
        var thedynamicbodydef=new thebodydef;
        thedynamicbodydef.type=thebody.b2_dynamicBody;
        thedynamicbodydef.position.x=container.x/SCALE;
        thedynamicbodydef.position.y=container.y/SCALE;
        
        var thedynamicbody=world.CreateBody(thedynamicbodydef);
        thedynamicbody.CreateFixture(bodyfixturedef);
        
        var actor=new theactorObject(thedynamicbody,container);
        thedynamicbody.SetUserData(actor);
        bodies.push(thedynamicbody);
        
     };
     
     var killBody=function(thelocbody){
       thelocbody.SetUserData(null);
					world.DestroyBody(thelocbody);
     }
        
        var update=function(){
            for(var i=0; i<bodiesToRemove.length; i++) {
					removeActor(bodiesToRemove[i].GetUserData());
					bodiesToRemove[i].SetUserData(null);
					world.DestroyBody(bodiesToRemove[i]);
				}
				bodiesToRemove = [];
                
            	for(var i=0; i<actors.length; i++) {
            	   
            	  
    					actors[i].update(i);
                        
    				}
            world.Step(TIMESTEP, 10, 10);	
            world.ClearForces();
           // world.DrawDebugData();
            if(bodies.length > 8) {
	   				bodiesToRemove.push(bodies[0]);
	   				bodies.splice(0,1);
	   			}
        };
        var removeActor = function(actor) {
			stage.removeChild(actor.container);
			actors.splice(actors.indexOf(actor),1);
		}
        var addDebug = function() {
			var debugDraw = new thedebugDraw();
			debugDraw.SetSprite(debugContext);
			debugDraw.SetDrawScale(SCALE);
			debugDraw.SetFillAlpha(0.7);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(thedebugDraw.e_shapeBit | thedebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
		};
        
        
        return{setup:setup,addDebug:addDebug,update:update,addBodies:addBodies,killBody:killBody};
    }());
    
    
    var tick=function(timeElapsed){
         //this is the place where you add more balls
        myphysics.update();
        stage.update();
        
        spawnCircleCounter++;
        if(spawnCircleCounter%20===0){
        theGreatCircles.spawn();
        }
        
    };
    
    
    
    return{tick:tick};
}());