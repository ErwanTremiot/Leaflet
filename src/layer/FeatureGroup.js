/*
 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and bindPopup method shared between a group of layers.
 */

L.FeatureGroup = L.LayerGroup.extend({
	includes: L.Mixin.Events,

	addLayer: function (layer) {
		layer.on('click dblclick mouseover mouseout', this._propagateEvent, this);

		L.LayerGroup.prototype.addLayer.call(this, layer);

		if (this._popupContent && layer.bindPopup) {
			layer.bindPopup(this._popupContent);
		}

		return this;
	},

	removeLayer: function (layer) {
		layer.off('click dblclick mouseover mouseout', this._propagateEvent, this);

		L.LayerGroup.prototype.removeLayer.call(this, layer);

		return this.invoke('unbindPopup');
	},

	bindPopup: function (content) {
		this._popupContent = content;
		return this.invoke('bindPopup', content);
	},

	setStyle: function (style) {
		return this.invoke('setStyle', style);
	},

	getBounds: function () {
		var bounds = new L.LatLngBounds();
		this._iterateLayers(function (layer) {
			bounds.extend(layer instanceof L.Marker ? layer.getLatLng() : layer.getBounds());
		}, this);
		return bounds;
	},

	_propagateEvent: function (e) {
		e.layer  = e.target;
		e.target = this;

		this.fire(e.type, e);
	}
});

L.featureGroup = function (layers) {
	return new L.FeatureGroup(layers);
};