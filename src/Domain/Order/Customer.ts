export class Customer{
    private _salutation: string;
    private _firstName: string;
    private _lastName: string;
    private _email: string;

    constructor(
        salutation: string,
        firstName: string,
        lastName: string,
        email: string,
    ) {
        this._salutation = salutation;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
    }
    static create(
        salutation: string,
        firstName: string,
        lastName: string,
        email: string,
    ): Customer {
        const customer = new Customer(salutation, firstName, lastName, email);
        return customer;
    }

    get salutation(): string {
        return this._salutation;
    }
    get firstName(): string {
        return this._firstName;
    }
    get lastName(): string {
        return this._lastName;
    }
    get email(): string {
        return this._email;
    }
}