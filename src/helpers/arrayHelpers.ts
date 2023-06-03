interface Array<T> {
    _pickRandomValue():any
}

Array.prototype._pickRandomValue = function(this:Array<any>):any { return this[ Math.floor( Math.random() * this.length ) ] }