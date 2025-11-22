import { Entity, UUIDEntityId } from '@domaincrafters/domain';
import { Guard } from '@domaincrafters/std';

export class MovieId extends UUIDEntityId {
    constructor(id?: string) {
        super(id);
    }

    static create(id?: string): MovieId {
        return new MovieId(id);
    }

}

export class Movie extends Entity {
    private _title: string;
    private _duration: number;
    private _genres: string[];
    private _posterUrl: string;

    constructor(
        id: MovieId,
        title: string,
        duration: number,
        genres: string[],
        posterImage: string,
    ) {
        super(id);
        this._title = title;
        this._duration = duration;
        this._genres = genres;
        this._posterUrl = posterImage;
    }

    static create(
        id: MovieId,
        title: string,
        duration: number,
        genres: string[],
        posterUrl: string,
    ): Movie {
        const movie = new Movie(id, title, duration, genres, posterUrl);
        movie.validateState();
        return movie;
    }

    get title(): string {
        return this._title;
    }

    get duration(): number {
        return this._duration;
    }

    get genres(): string[] {
        return this._genres;
    }

    get posterImage(): string {
        return this._posterUrl;
    }

    public override validateState(): void {
        Guard.check(this._title, 'Title').againstEmpty();
        Guard.check(this._duration, 'Duration').againstNegative().againstZero();
        Guard.check(this._genres, 'Genres').againstEmpty();
        Guard.check(this._posterUrl, 'PosterImage').againstEmpty();
    }
}