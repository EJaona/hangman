interface String {
    _toCapitalize(): string;
    _map(cb:(value:string, i?:number) => void):number[]
}

String.prototype._toCapitalize = function (this:string):string { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()}

String.prototype._map = function(this:string, cb):number[] {
    let value = [];

    for(let i = 0; i < this.length; i++){
        value.push(cb(this[i], i))
    }

    return value
}