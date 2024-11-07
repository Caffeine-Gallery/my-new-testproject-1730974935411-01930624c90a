import Error "mo:base/Error";

import Float "mo:base/Float";

actor Calculator {
    public func add(x : Float, y : Float) : async Float {
        x + y
    };

    public func subtract(x : Float, y : Float) : async Float {
        x - y
    };

    public func multiply(x : Float, y : Float) : async Float {
        x * y
    };

    public func divide(x : Float, y : Float) : async Float {
        if (y == 0) {
            throw Error.reject("Division by zero");
        };
        x / y
    };
}
