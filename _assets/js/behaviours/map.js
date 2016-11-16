import GoogleMapsLoader from 'google-maps'
import { isMobile } from '../helpers/utils'
GoogleMapsLoader.KEY = 'AIzaSyBuYsutCyiOrTigGmFcdF-2kpO5YTqGlCc'

export const map = (container) => typeof google === 'undefined' ? GoogleMapsLoader.load(mapLoaded.bind(null, container)) : mapLoaded(container)

const mapLoaded = () => {
	const location = new google.maps.LatLng(51.498087, -0.136534)
	const useFeature = !isMobile()
	const mapOptions = {
		zoom: 16,
		center: location,
		styles: [{'featureType':'water','elementType':'geometry','stylers':[{'color':'#e9e9e9'},{'lightness':17}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#f5f5f5'},{'lightness':20}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#ffffff'},{'lightness':17}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#ffffff'},{'lightness':29},{'weight':0.2}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#ffffff'},{'lightness':18}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#ffffff'},{'lightness':16}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#f5f5f5'},{'lightness':21}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#dedede'},{'lightness':21}]},{'elementType':'labels.text.stroke','stylers':[{'visibility':'on'},{'color':'#ffffff'},{'lightness':16}]},{'elementType':'labels.text.fill','stylers':[{'saturation':36},{'color':'#333333'},{'lightness':40}]},{'elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'geometry','stylers':[{'color':'#f2f2f2'},{'lightness':19}]},{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'color':'#fefefe'},{'lightness':20}]},{'featureType':'administrative','elementType':'geometry.stroke','stylers':[{'color':'#fefefe'},{'lightness':17},{'weight':1.2}]}],
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		zoomControl: useFeature,
		scaleControl: false,
		mapTypeControl: useFeature,
		streetViewControl: false,
		scrollwheel: false,
		draggable: useFeature,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.TOP_RIGHT
		}
	}

	const map = map || new google.maps.Map(document.getElementById('map_canvas'), mapOptions)

	function drop() {
		setTimeout(addMarker, 200)
	}
	
	function addMarker() {
		const icon = new google.maps.MarkerImage('/_assets/images/map_marker.png')
		/*const marker = */new google.maps.Marker({
			position: location,
			map: map,
			draggable: false,
			animation: google.maps.Animation.DROP,
			icon:icon
		})
	}
	// drop icon
	drop()
}