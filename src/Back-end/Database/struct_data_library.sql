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
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (admin_id, user_id) FROM stdin;
3	13
4	25
\.


--
-- Data for Name: book_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_category (book_id, category_id) FROM stdin;
1	1
12	1
17	1
19	1
3	2
2	2
13	1
11	2
18	3
37	2
38	2
14	1
40	1
40	2
\.


--
-- Data for Name: book_issues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_issues (issue_id, book_id, student_id, issue_date, due_date, return_date, fine_amount, status, reminder_sent, reminder_sent_at, overdue_reminder_sent, overdue_reminder_sent_at) FROM stdin;
4	1	7	2025-05-25	2025-06-08	2025-05-25	0	returned	f	\N	f	\N
6	13	5	2025-06-08	2025-06-22	2025-06-08	0	returned	f	\N	f	\N
7	13	5	2025-06-08	2025-06-22	2025-06-08	0	returned	f	\N	f	\N
8	13	5	2025-06-08	2025-06-22	2025-06-13	0	returned	f	\N	f	\N
9	13	5	2025-06-08	2025-06-22	2025-06-13	0	returned	f	\N	f	\N
10	13	5	2025-06-13	2025-06-27	2025-06-15	0	returned	f	\N	f	\N
2	2	5	2023-04-05	2023-04-19	2023-04-20	0	returned	f	\N	f	\N
5	1	7	2025-05-25	2025-06-08	2025-06-15	18.5	returned	f	\N	f	\N
11	12	9	2025-06-15	2025-06-29	2025-06-15	0	returned	f	\N	f	\N
14	1	9	2025-01-01	2025-01-14	2025-06-15	366.6	returned	f	\N	f	\N
12	13	5	2025-06-15	2025-06-29	2025-06-15	0	returned	f	\N	f	\N
3	3	6	2023-04-10	2023-05-24	2025-06-15	189	returned	f	\N	f	\N
15	1	9	2025-06-15	2025-06-29	2025-06-15	0	returned	f	\N	f	\N
16	18	9	2025-06-17	2025-07-01	2025-06-17	0	returned	f	\N	f	\N
\.


--
-- Data for Name: book_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_requests (request_id, book_id, student_id, request_date, status) FROM stdin;
2	3	1	2023-04-11	approved
4	1	1	2025-05-25	approved
6	13	5	2025-06-08	approved
5	13	5	2025-06-08	pending
7	13	5	2025-06-08	approved
9	13	5	2025-06-13	approved
12	12	9	2025-06-14	pending
14	12	9	2025-06-14	pending
16	13	9	2025-06-14	pending
13	12	9	2025-06-14	approved
8	13	5	2025-06-08	approved
15	1	9	2025-06-14	approved
18	1	9	2025-06-15	approved
19	13	5	2025-06-15	pending
10	12	9	2025-06-14	rejected
11	12	9	2025-06-14	rejected
20	18	9	2025-06-17	approved
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books (book_id, title, publisher_id, publication_year, quantity, availability, price, author, image_url) FROM stdin;
3	Book C	3	2018-01-01	4	available	600000	Author C	\N
12	Book D	1	2025-01-01	4	available	20000	BKH	\N
1	Book A	1	2020-01-01	10	available	500000	Author A	\N
2	Book B	2	2019-01-01	5	available	450000	Author BC	\N
13	Book D	1	2025-01-01	4	available	20000	BKHHH	null
11	Book E	1	2025-01-01	40	available	20000	BKHHHH	\N
37	aBG	3	2025-01-01	3	\N	558	VH xấu trai	/uploads/1749986229880-428651264.jpg
38	qử	2	2025-01-01	1	\N	0	qử	/uploads/1749986483770-720515486.jpg
14	Book D	1	2025-01-01	44	available	20000	BKH	\N
40	Book BKH	1	2025-02-02	0	unavailable	20000	BKHH	\N
15	Book D	1	2025-02-02	4	available	20000	BKH	\N
16	Book D	1	2025-02-02	4	available	20000	BKH	\N
17	Book D	1	2025-02-02	4	available	20000	BKH	\N
19	Book F	1	2025-02-02	4	available	20000	BKH	\N
6	Book D	1	2025-01-01	4	available	20000	BKH	
7	Book D	1	2025-01-01	4	available	20000	BKH	
9	Book D	1	2025-01-01	4	available	20000	BKH	
10	Book D	1	2025-01-01	4	available	20000	BKH	
18	Book D	1	2025-01-01	9	available	20000	LVH	\N
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (category_id, name, description) FROM stdin;
1	Science	Books related to science
2	Fiction	Fictional stories and novels
3	Technology	Books on software and engineering
5	Romantic	LOVE
\.


--
-- Data for Name: librarians; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.librarians (librarian_id, user_id, start_date, end_date) FROM stdin;
2	16	2025-05-27	\N
3	18	2025-05-27	\N
4	20	2025-05-27	\N
5	24	2025-06-03	\N
\.


--
-- Data for Name: library_cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.library_cards (card_id, student_id, start_date, end_date, status) FROM stdin;
2	2	2023-02-01	2023-12-31	pending
3	3	2023-03-01	2023-12-31	accepted
7	1	2025-05-26	2027-05-26	accepted
\.


--
-- Data for Name: publishers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publishers (publisher_id, name, address, phone_number, email) FROM stdin;
2	OReilly Media	456 Second St	0987654321	\N
3	McGraw Hill	789 Third St	0222333444	\N
1	Pearson	123 Main St	0123456789	pearson@gmail.com
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (student_id, user_id, class_id) FROM stdin;
7	21	\N
6	17	CSC10
9	26	CSC0000
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password, email, name, role, reset_token, reset_token_expire) FROM stdin;
16	hungle	$2b$10$jHPgGH6S7J03BH2v7bTqnOba7y9EYa/PcGJ1CDYRG3TlT58Xn46Ui	leviethung4@gmail.com	VIET HUNG	L	\N	\N
18	khanhhung1233	$2b$10$gOF/efY5baXezHaWTXGf.eyew6YqFR/iQf9HCtQEmSkGMnSXnKIQu	khung1111@gmail.com	Hung Khah	L	\N	\N
19	khanhng1233	$2b$10$DMFwGIc5k72qLCMQgACYvOhRyJDAKDYwJYRSRezzUJuynfTlXHQAi	khung111@gmail.com	Hung Khanhhhh	S	\N	\N
20	khanhhung124433	$2b$10$lbxznc1jBlm.ASJ5tyoz6.7AfJiIIqmZuaJw.5M.FOcqJMYO/W2rS	khung111441@gmail.com	Hung Khah	L	\N	\N
21	g124433	$2b$10$BPAmf.k6EQHNbC8e02xuPeWSbcS1SQL7mMDGw/vQYNLvAIepPl9jS	ng111441@gmail.com	Hung Khah	S	\N	\N
22	g123	$2b$10$w1.YiPd.oaTvw2FkDSmmg.vjIst27Gzl24qnH9gas95BLRyTamCem	ng1141@gmail.com	Hung Khah	S	\N	\N
13	reddo	$2b$10$B256BS.R7PM3bX82uBl9YuEKaBnd4Ukpv5Vs5Q8B14eUfoxpXJczC	leviethung1792k4@gmail.com	LÊ VIET HUNG	A	\N	\N
24	gh123	$2b$10$YrF/AmXqLmz8fewZg51n5.qXbyneiTAlM2MvmwUTn7FntmOg73BE2	ng1ggggggg1@gmail.com	Hung Khah	L	\N	\N
17	khanhhung	$2b$10$cLGnFyw0nSEQQIF3XOqFyOcJTDCXgcWgT8i41kW6CLj6S0CryWauu	khung@gmail.com	Hung Dien	S	\N	\N
25	ABCDE	$2b$10$mgItyaA.swOOefRzhLQexeLp1xUgPwfqSElxvvOSwjD2lcOUZG9v2	bkhh@example.com	Tester	A	\N	\N
26	VH xấu trai	$2b$10$HSMHar9ea0md1JlZAX1JyOGNAtLeJJQ7qSOmzA7/9lGEJB6NcmZEW	bkhhh@example.com	ádasdas	S	\N	\N
\.


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist (wishlist_id, student_id, book_id, created_date) FROM stdin;
5	6	1	2025-06-08
6	6	2	2025-06-08
7	6	18	2025-06-08
\.


--
-- Name: admins_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 4, true);


--
-- Name: book_issues_issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_issues_issue_id_seq', 16, true);


--
-- Name: book_requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_requests_request_id_seq', 20, true);


--
-- Name: books_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.books_book_id_seq', 40, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 7, true);


--
-- Name: librarians_librarian_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.librarians_librarian_id_seq', 5, true);


--
-- Name: library_cards_card_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.library_cards_card_id_seq', 13, true);


--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publishers_publisher_id_seq', 5, true);


--
-- Name: students_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_student_id_seq', 9, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 26, true);


--
-- Name: wishlist_wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wishlist_wishlist_id_seq', 7, true);


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

