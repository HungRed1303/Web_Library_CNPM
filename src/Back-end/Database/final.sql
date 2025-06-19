--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
    CONSTRAINT book_issues_status_check CHECK (((status)::text = ANY (ARRAY[('returned'::character varying)::text, ('issuing'::character varying)::text])))
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
    CONSTRAINT book_requests_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('approved'::character varying)::text, ('rejected'::character varying)::text])))
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
    CONSTRAINT books_availability_check CHECK (((availability)::text = ANY (ARRAY[('available'::character varying)::text, ('unavailable'::character varying)::text])))
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
    CONSTRAINT library_cards_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('accepted'::character varying)::text])))
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
1	3
\.


--
-- Data for Name: book_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_category (book_id, category_id) FROM stdin;
1	1
2	2
3	3
4	1
5	1
6	4
7	2
8	3
9	3
10	3
11	1
12	1
13	3
14	4
15	2
16	4
17	4
\.


--
-- Data for Name: book_issues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_issues (issue_id, book_id, student_id, issue_date, due_date, return_date, fine_amount, status, reminder_sent, reminder_sent_at, overdue_reminder_sent, overdue_reminder_sent_at) FROM stdin;
\.


--
-- Data for Name: book_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.book_requests (request_id, book_id, student_id, request_date, status) FROM stdin;
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books (book_id, title, publisher_id, publication_year, quantity, availability, price, author, image_url) FROM stdin;
1	Trại Hoa Vàng	1	2025-01-01	5	available	30000	Nguyễn Nhật Ánh	/uploads/1750316489952-181058105.jpg
2	Thiên Thần Nhỏ của tôi	2	2025-01-01	20	available	20000	Nguyễn Nhật Ánh	/uploads/1750316534500-867028450.png
3	Hoa Vàng	2	2025-01-01	10	available	40000	Nguyễn Nhật Ánh	/uploads/1750316587140-144635062.jpg
4	Ngày xưa có một chuyện tình	1	2000-01-01	10	available	40000	Nguyễn Nhật Ánh	/uploads/1750316663051-372319776.jpg
5	Cô gái đến từ hôm qua	3	2025-01-01	20	available	90000	Nguyễn Ánh	/uploads/1750316842278-794099533.jpg
6	Luật hấp dẫn	3	2025-01-01	20	available	10000	Newton	/uploads/1750317058245-636425402.webp
7	Có thai thì không thể li hôn sao	1	2025-01-01	10	available	10000	Vô danh	/uploads/1750317301790-93337118.webp
8	Mặt trăng	2	2025-01-01	10	available	90000	Sun 	/uploads/1750317348110-115934450.webp
9	Săn cá thần	1	2019-01-01	5	available	50000	Phạm Thiều Quang	/uploads/1750317449102-723405802.jpg
10	Cá Quái	1	2025-01-01	10	available	70000	Otaku	/uploads/1750317501940-849958240.jpg
11	Hoàn hảo ở đâu	3	2025-01-01	8	available	40000	Vô Lượng	/uploads/1750317557871-867564052.jpg
12	Anh không muốn em một mình 	3	2025-01-01	6	available	20400	Vô Diệp	/uploads/1750317711079-22511722.jpg
13	Vầng trăng lõm	2	2025-01-01	8	available	10000	Yểm Nguyệt	/uploads/1750317783216-5193931.jpg
14	Tự phàm	2	2025-01-01	3	available	12000	Vô Tình	/uploads/1750317843564-133489031.gif
15	Tôi là ai ?	3	2025-01-01	4	available	20000	Your Name	/uploads/1750317908394-704752516.jpg
16	Quái vật trong đêm	3	2025-01-01	2	available	100000	Demon	/uploads/1750318312801-979272178.jpg
17	Đơn Giản	1	2025-01-01	1	available	18000	Ez	/uploads/1750318650140-153952409.jpg
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (category_id, name, description) FROM stdin;
1	Tiểu thuyết	Khi thế giới thực quá nhàm chán, tiểu thuyết mở ra cánh cửa đến những vùng đất kỳ diệu. Ở đó, bạn có thể sống hàng trăm cuộc đời, yêu một người không tồn tại, hoặc bước vào hành trình thay đổi cả vũ trụ chỉ với vài trang giấy
2	Tâm lý – Kỹ năng sống	Cuộc sống không đi kèm hướng dẫn sử dụng, nhưng sách kỹ năng sống chính là kim chỉ nam giúp bạn hiểu rõ bản thân, vượt qua khó khăn và sống trọn vẹn hơn mỗi ngày
3	Lịch sử – Văn hóa	Bạn không thể đi ngược thời gian, nhưng có thể cảm nhận hơi thở của quá khứ qua từng trang sách lịch sử. Mỗi nền văn hóa, mỗi cuộc chiến, mỗi triều đại đều mang đến bài học quý giá cho hiện tại và tương lai.
4	Khoa học – Khám phá	Từ những hạt cơ bản nhất của vũ trụ đến bí ẩn về trí não con người, sách khoa học là cầu nối giữa tò mò và hiểu biết. Mỗi trang sách là một bước tiến gần hơn đến việc giải mã thế giới.
\.


--
-- Data for Name: librarians; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.librarians (librarian_id, user_id, start_date, end_date) FROM stdin;
1	2	2025-06-19	\N
\.


--
-- Data for Name: library_cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.library_cards (card_id, student_id, start_date, end_date, status) FROM stdin;
\.


--
-- Data for Name: publishers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publishers (publisher_id, name, address, phone_number, email) FROM stdin;
1	Kim Đồng	Quảng Trị	19009191	ha@gmail.com
2	Vương Lâm	HCM\n	111111111	lv@gmail.com
3	Alack	Hà Nội\n	12345678	al@gmai.com
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (student_id, user_id, class_id) FROM stdin;
1	1	CSC101
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, password, email, name, role, reset_token, reset_token_expire) FROM stdin;
3	gia hung	$2b$10$7RMRuG0TxOPZPJmDyBKP0OgheC13d7RyohXoP5nKBu4zs1q47DkIC	giahung@gmail.com	Gia Hung	A	\N	\N
2	bui khanh hung	$2b$10$1OIqUq4UMHIuOaPCVFQUf./jeh1Ip/yFucrJgJbhfN7MFfsitzIOG	buikhanhhung@gmail.com	Bui Khanh Hung	L	\N	\N
1	leviethung	$2b$10$Z9TLyWPyVtRYlrfiZeTJ3OQVJfFZ3zR2CP8tfPyRLjAlx7rJqL4Lu	leviethung1792k4@gmail.com	Le Viet Hung	S	\N	\N
\.


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist (wishlist_id, student_id, book_id, created_date) FROM stdin;
1	1	1	2025-06-19
2	1	4	2025-06-19
\.


--
-- Name: admins_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 1, true);


--
-- Name: book_issues_issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_issues_issue_id_seq', 1, false);


--
-- Name: book_requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_requests_request_id_seq', 1, false);


--
-- Name: books_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.books_book_id_seq', 17, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 4, true);


--
-- Name: librarians_librarian_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.librarians_librarian_id_seq', 1, true);


--
-- Name: library_cards_card_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.library_cards_card_id_seq', 1, false);


--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publishers_publisher_id_seq', 3, true);


--
-- Name: students_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_student_id_seq', 1, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- Name: wishlist_wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wishlist_wishlist_id_seq', 2, true);


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

