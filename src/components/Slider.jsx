import React, { Component } from 'react';
class Slider extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          activeIndex: 0,
          items:this.props.items,
        };
      }
    	componentDidUpdate(prevProps) {
        //console.log(prevProps.advanceLoanRow,this.props.advanceLoanRow);
    
            if(prevProps.items !== this.props.items) {
              this.setState({items:this.props.items})
            }
         }
      goToSlide(index) {
        this.setState({ activeIndex: index });
      }
    
      goToPrevSlide(e) {
        e.preventDefault();
    
        let index = this.state.activeIndex;
        let { slides } = this.props;
        let slidesLength = slides.length;
    
        if (index < 1) {
          index = slidesLength;
        }
    
        --index;
    
        this.setState({
          activeIndex: index
        });
      }
    
      goToNextSlide(e) {
        e.preventDefault();
    
        let index = this.state.activeIndex;
        let { slides } = this.props;
        let slidesLength = slides.length - 1;
    
        if (index === slidesLength) {
          index = -1;
        }
    
        ++index;
    
        this.setState({
          activeIndex: index
        });
      }
      myMove() {
        var elem = document.getElementById("myAnimation");   
        var pos = 0;
        var id = setInterval(frame, 10);
        function frame() {
          if (pos == 350) {
            clearInterval(id);
          } else {
            pos++; 
            elem.style.top = pos + 'px'; 
            elem.style.left = pos + 'px'; 
          }
        }
      }
    render() {
      {
        //console.log('render slider',this.state.items)
      if(this.state.items)
      {
        return (
          <div className="carousel">
            <a
              href="#"
              className="carousel__arrow arrow--left"
              onClick={e => this.goToPrevSlide(e)}
            >
              <span className="fa fa-2x fa-angle-left" />
            </a>
    
            <ul className="carousel__slides">
          {this.state.items.map((slide, index) =>
            <li
              className={
                index == this.state.activeIndex
                  ? "myTeamSlider carousel__slide carousel__slide--active active"
                  : "myTeamSlider carousel__slide"
              }
              key={index}
            >
             {slide}   
            </li>
          )}
        </ul>
    
            <a
              href="#"
              className="carousel__arrow arrow--right"
              onClick={e => this.goToNextSlide(e)}
            >
              <span className="fa fa-2x fa-angle-right" />
            </a>
    
            <ul className="carousel__indicators">
              {this.state.items.map((slide, index) =>
                <li key={index}>
                  <a
                    className={
                      index == this.state.activeIndex
                        ? "carousel__indicator carousel__indicator--active"
                        : "carousel__indicator"
                    }
                    onClick={e => this.goToSlide(index)}
                  />
                </li>
              )}
            </ul>
          </div>
        )
      }
      else{
        return '';
      }
                  }
      }
    }
export default Slider;