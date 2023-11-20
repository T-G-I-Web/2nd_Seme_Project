import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Import useEffect and useState

const ImageInfo = styled.div`
  position: absolute;
  width: 194px;
  height: 285px;
  background: #d9d9d9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  overflow: hidden; /* Ensure the image doesn't overflow the div */
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%; /* Adjust the height of the image portion */
  object-fit: cover; /* Maintain aspect ratio and cover the div */
`;

const GradeInfo = styled.div`
  position: absolute;
  width: 65px;
  height: 27px;
  background: #1C1E2C;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: ${(props) => {
    if (props.rating == 0) {
      return '17px';
    } 
    else {
      return '20px';
    }
  }};
  display: flex;
  justify-content: center;
  line-height: 30px;
  color: ${(props) => {
    if (props.rating >= 8.5) {
      return '#4D96FF';
    } else if (props.rating >= 7.5) {
      return '#6BCB77';
    } else if (props.rating >= 6.5) {
      return '#FFD93D';
    }
    else {
      return '#FF6B6B';
    }
  }};

`;

const ReservInfo = styled.button`
  position: absolute;
  width: 119px;
  height: 27px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: #898FC0;
  color: black;
  font-family: 'Noto Sans KR', sans-serif;
`;


function BoxOffice() {
  const [movieData, setMovieData] = useState([]);
  const [moviePost, setMoviePost] = useState([]);

  const getMovies = async () => {
    // searchName 파라미터 추가
    const koficResponse = await (
      await fetch(
        `http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=c41addc3237a2809a6569efc778d609e&targetDt=20231117`
      )
    ).json();
    const boxOfficeData = koficResponse.boxOfficeResult.dailyBoxOfficeList;
    const movieTitles = boxOfficeData.map((movie) => movie.movieNm);
    setMovieData(movieTitles);
  };

  const getPost = async (titles) => {
    const KEY = '0d38cc635c10e090910f3d7ea7194e05'; // Replace with your TMDb API key
    const URL = 'https://api.themoviedb.org/3';
    const promises = titles.map(async (title) => {
      // Search for the movie by title
      const tmdbResponse = await fetch(
        `${URL}/search/movie?api_key=${KEY}&language=ko-KR&page=1&query=${title}`
      );
      const tmdbJson = await tmdbResponse.json();
      const movie = tmdbJson.results[0];
      if (movie) {
        // Fetch additional movie details by movie ID to get the director's information
        const movieDetailsResponse = await fetch(
          `${URL}/movie/${movie.id}?api_key=${KEY}&language=ko-KR&append_to_response=credits`
        );
        const movieDetailsJson = await movieDetailsResponse.json();
        const director = movieDetailsJson.credits.crew.find((person) => person.job === 'Director');
        const genres = movieDetailsJson.genres.slice(0, 2).map((genre) => genre.name);
        return {
          title,
          posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          vote_average: movie.vote_average,
          release_date : movie.release_date,
          director: director ? director.name : 'Director not found',
          genres: genres.join(' / '),
        };
      }
  
      // Return a placeholder if the movie is not found
      return {
        title,
        posterUrl: null,
        vote_average: null,
        director: 'Director not found',
        genres: 'Genres not found',
      };
    });
    return Promise.all(promises);
  };
  

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    if (movieData.length > 0) {
      getPost(movieData).then(setMoviePost);
    }
  }, [movieData]);

  const ImageData = () => {};

  const GradeData = () => {};

  const ReservData = () => {};

  return (
    <>
      {moviePost.map((movie, index) => (
        <ImageInfo
          key={index}
          style={{ left: `${index * 291}px`, top: '0px' }}
          onClick={ImageData}
        >
          <PosterImage src={movie.posterUrl} alt={movie.title} />
          {/* <Title>{movie.title}</Title> Display the movie title */}
        </ImageInfo>
      ))}

      {moviePost.map((movie, index) => (
        <GradeInfo
          key={index}
          style={{ left: `${index * 291}px`, top: '295px' }}
          onClick={GradeData}
          rating={movie.vote_average} // Pass the rating as a prop
        >
          {movie.vote_average === 0 ? 'X.X' : movie.vote_average.toFixed(1)}
        </GradeInfo>
      ))}

      {moviePost.map((movie, index) => (
        <Link key={index} to={`/page4?voteAvg=${movie.vote_average}&posterUrl=${movie.posterUrl}&directorName=${movie.director}&releaseDate=${movie.release_date}&genres=${movie.genres}&title=${movie.title}`}>
          <ReservInfo
            style={{ left: `${index * 291 + 75}px`, top: '295px' }}
            onClick={ReservData}
          >
            예매
          </ReservInfo>
        </Link>
        
      ))}
    </>
  );
}

export default BoxOffice;
