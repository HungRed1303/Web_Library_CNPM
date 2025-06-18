--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: admins_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_admin_id_seq OWNER TO postgres;

--
-- Name: admins_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;


--
-- Name: book_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_category (
    book_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.book_category OWNER TO postgres;

--
-- Name: book_issues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_issues (
    issue_id integer NOT NULL,
    book_id integer NOT NULL,
    student_id integer NOT NULL,
    issue_date date,
    due_date date,
    return_date date,
    fine_amount double precision,
    status character varying(10) NOT NULL,
    reminder_sent boolean DEFAULT false,
    reminder_sent_at timestamp without time zone,
    overdue_reminder_sent boolean DEFAULT false,
    overdue_reminder_sent_at timestamp without time zone,
    CONSTRAINT book_issues_status_check CHECK (((status)::text = ANY ((ARRAY['returned'::character varying, 'issuing'::character varying])::text[])))
);


ALTER TABLE public.book_issues OWNER TO postgres;

--
-- Name: book_issues_issue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.book_issues_issue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_issues_issue_id_seq OWNER TO postgres;

--
-- Name: book_issues_issue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.book_issues_issue_id_seq OWNED BY public.book_issues.issue_id;


--
-- Name: book_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_requests (
    request_id integer NOT NULL,
    book_id integer NOT NULL,
    student_id integer NOT NULL,
    request_date date,
    status character varying(10),
    CONSTRAINT book_requests_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.book_requests OWNER TO postgres;

--
-- Name: book_requests_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.book_requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_requests_request_id_seq OWNER TO postgres;

--
-- Name: book_requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.book_requests_request_id_seq OWNED BY public.book_requests.request_id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    book_id integer NOT NULL,
    title character varying(100) NOT NULL,
    publisher_id integer NOT NULL,
    publication_year date NOT NULL,
    quantity integer NOT NULL,
    availability character varying(255),
    price integer NOT NULL,
    author character varying(50) NOT NULL,
    image_url character varying(255),
    CONSTRAINT books_availability_check CHECK (((availability)::text = ANY ((ARRAY['available'::character varying, 'unavailable'::character varying])::text[])))
);


ALTER TABLE public.books OWNER TO postgres;

--
-- Name: books_book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.books_book_id_seq OWNER TO postgres;

--
-- Name: books_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name character varying(50),
    description character varying(1000)
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: librarians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.librarians (
    librarian_id integer NOT NULL,
    user_id integer NOT NULL,
    start_date date,
    end_date date
);


ALTER TABLE public.librarians OWNER TO postgres;

--
-- Name: librarians_librarian_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.librarians_librarian_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.librarians_librarian_id_seq OWNER TO postgres;

--
-- Name: librarians_librarian_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.librarians_librarian_id_seq OWNED BY public.librarians.librarian_id;


--
-- Name: library_cards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.library_cards (
    card_id integer NOT NULL,
    student_id integer NOT NULL,
    start_date date,
    end_date date,
    status character varying(10),
    CONSTRAINT library_cards_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying])::text[])))
);


ALTER TABLE public.library_cards OWNER TO postgres;

--
-- Name: library_cards_card_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.library_cards_card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.library_cards_card_id_seq OWNER TO postgres;

--
-- Name: library_cards_card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.library_cards_card_id_seq OWNED BY public.library_cards.card_id;


--
-- Name: publishers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publishers (
    publisher_id integer NOT NULL,
    name character varying(100),
    address character varying(100),
    phone_number character varying(12),
    email character varying(255)
);


ALTER TABLE public.publishers OWNER TO postgres;

--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.publishers_publisher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publishers_publisher_id_seq OWNER TO postgres;

--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publishers_publisher_id_seq OWNED BY public.publishers.publisher_id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    student_id integer NOT NULL,
    user_id integer NOT NULL,
    class_id character varying(10)
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: students_student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_student_id_seq OWNER TO postgres;

--
-- Name: students_student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_student_id_seq OWNED BY public.students.student_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    name character varying(100),
    role character varying(10),
    reset_token character varying(255),
    reset_token_expire timestamp without time zone,
    CONSTRAINT role_check CHECK (((role)::text = ANY (ARRAY[('A'::character varying)::text, ('L'::character varying)::text, ('S'::character varying)::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist (
    wishlist_id integer NOT NULL,
    student_id integer NOT NULL,
    book_id integer NOT NULL,
    created_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.wishlist OWNER TO postgres;

--
-- Name: wishlist_wishlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wishlist_wishlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wishlist_wishlist_id_seq OWNER TO postgres;

--
-- Name: wishlist_wishlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wishlist_wishlist_id_seq OWNED BY public.wishlist.wishlist_id;


--
-- Name: admins admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq'::regclass);


--
-- Name: book_issues issue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_issues ALTER COLUMN issue_id SET DEFAULT nextval('public.book_issues_issue_id_seq'::regclass);


--
-- Name: book_requests request_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests ALTER COLUMN request_id SET DEFAULT nextval('public.book_requests_request_id_seq'::regclass);


--
-- Name: books book_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: librarians librarian_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.librarians ALTER COLUMN librarian_id SET DEFAULT nextval('public.librarians_librarian_id_seq'::regclass);


--
-- Name: library_cards card_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.library_cards ALTER COLUMN card_id SET DEFAULT nextval('public.library_cards_card_id_seq'::regclass);


--
-- Name: publishers publisher_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publishers ALTER COLUMN publisher_id SET DEFAULT nextval('public.publishers_publisher_id_seq'::regclass);


--
-- Name: students student_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN student_id SET DEFAULT nextval('public.students_student_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: wishlist wishlist_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist ALTER COLUMN wishlist_id SET DEFAULT nextval('public.wishlist_wishlist_id_seq'::regclass);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- Name: book_category book_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_category
    ADD CONSTRAINT book_category_pkey PRIMARY KEY (book_id, category_id);


--
-- Name: book_issues book_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_issues
    ADD CONSTRAINT book_issues_pkey PRIMARY KEY (issue_id);


--
-- Name: book_requests book_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests
    ADD CONSTRAINT book_requests_pkey PRIMARY KEY (request_id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: librarians librarians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.librarians
    ADD CONSTRAINT librarians_pkey PRIMARY KEY (librarian_id);


--
-- Name: library_cards library_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.library_cards
    ADD CONSTRAINT library_cards_pkey PRIMARY KEY (card_id);


--
-- Name: publishers publishers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publishers
    ADD CONSTRAINT publishers_pkey PRIMARY KEY (publisher_id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (student_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: wishlist wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (wishlist_id);


--
-- Name: book_category fk_book; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_category
    ADD CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: book_issues fk_book_issue_book; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_issues
    ADD CONSTRAINT fk_book_issue_book FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: books fk_book_publisher; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT fk_book_publisher FOREIGN KEY (publisher_id) REFERENCES public.publishers(publisher_id) ON DELETE CASCADE;


--
-- Name: book_requests fk_book_request_book; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_requests
    ADD CONSTRAINT fk_book_request_book FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: book_category fk_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_category
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;


--
-- Name: students fk_user_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT fk_user_student FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: wishlist fk_wishlist_book; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT fk_wishlist_book FOREIGN KEY (book_id) REFERENCES public.books(book_id) ON DELETE CASCADE;


--
-- Name: wishlist fk_wishlist_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT fk_wishlist_student FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

