%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% The Legrand Orange Book
% LaTeX Class
% Version 3.1 (February 18, 2022)
%
% Authors:
% Vel (vel@latextemplates.com)
% Mathias Legrand (legrand.mathias@gmail.com)
% 
% This class originates from:
% https://www.LaTeXTemplates.com
%
% License:
% CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%----------------------------------------------------------------------------------------
%	CLASS CONFIGURATION
%----------------------------------------------------------------------------------------

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{LegrandOrangeBook}[2022/01/26 The Legrand Orange Book Class v3.0]

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{book}} % Pass through any options to the base class
\ProcessOptions\relax % Process given options

\LoadClass{book} % Load the base class

%----------------------------------------------------------------------------------------
%	 REQUIRED PACKAGES AND CONFIGURATIONS
%----------------------------------------------------------------------------------------

\usepackage{graphicx} % Required for including pictures
\graphicspath{{Images/}} % Specifies the directory where pictures are stored

\usepackage{float} % Allows more precisely positioning floats e.g. \begin{figure}[H]

\usepackage[usenames, svgnames, table]{xcolor} % Required for defining and using custom colors

\usepackage{calc} % For simpler calculations - used for spacing the index letter headings correctly

\usepackage{changepage} % Required for temporarily indenting text blocks

\usepackage[toc]{appendix} % Required for the appendices chapters

\usepackage{etoolbox} % Required for conditional logic and easily changing commands

%----------------------------------------------------------------------------------------
%	MARGINS
%----------------------------------------------------------------------------------------

\usepackage{geometry} % Required for adjusting page dimensions and margins

\geometry{
    top=3cm, % Top margin
    bottom=2.5cm, % Bottom margin
    inner=3cm, % Inner margin (left on odd pages, right on even or left in oneside mode)
    outer=3cm, % Outer margin (right on odd pages, left on even or right in oneside mode)
    headsep=10pt, % Space from the top margin to the baseline of the header
    headheight=0.5cm, % Header height
    footskip=1.4cm, % Space from the bottom margin to the baseline of the footer
    columnsep=1cm, % Horizontal space between columns when in two column mode
%showframe, % Uncomment to show how the type block is set on the page
}

%----------------------------------------------------------------------------------------
%	FONTS
%----------------------------------------------------------------------------------------

\usepackage[utf8]{inputenc} % Required for inputting international characters
\usepackage[T1]{fontenc} % Output font encoding for international characters

\usepackage{avant} % Use the Avantgarde font for headings

\usepackage{mathptmx} % Use the Adobe Times Roman as the default text font together with math symbols from the Sym­bol, Chancery and Com­puter Modern fonts

\usepackage{microtype} % Improve typography

%----------------------------------------------------------------------------------------
%	HEADERS AND FOOTERS
%----------------------------------------------------------------------------------------

\usepackage{fancyhdr} % Required for customizing headers and footers
\pagestyle{fancy} % Enable the custom headers and footers

\renewcommand{\headrulewidth}{0.5pt} % Top horizontal rule thickness

\renewcommand{\chaptermark}[1]{\markboth{\sffamily\normalsize\bfseries\chaptername\ \thechapter.~#1}{}} % Redefine the styling of the current chapter name in the header
\renewcommand{\sectionmark}[1]{\markright{\sffamily\normalsize\thesection~#1}{}} % Redefine the styling of the current section name in the header

\fancyhf{} % Clear default headers and footers

\fancyhead[LE, RO]{\sffamily\thepage} % Header for left even pages and right odd pages

\fancyhead[LO]{\rightmark} % Header for left odd pages

\fancyhead[RE]{\leftmark} % Header for right even pages

\fancypagestyle{plain}{ % Style for when a plain pagestyle is specified
    \fancyhead{} % Clear headers
    \renewcommand{\headrulewidth}{0pt} % Remove header rule
}

\usepackage{emptypage} % This package removes headers and footers on empty pages between chapters

%----------------------------------------------------------------------------------------
%	SECTION STYLING
%----------------------------------------------------------------------------------------

\setcounter{secnumdepth}{3} % Number sections down to subsubsections, a value of 2 will number to subsections only and 1 to sections only

\usepackage[
    explicit, % Specify section names explicitly in \titleformat with #1
    newparttoc, % Required for writing the part toc entry number in a standard way (overriding default LaTeX behavior) so the titletoc package can style it
]{titlesec} % Required for modifying sections

%-------------------------------------------

% Command to create and output the parts pages
\newcommand{\outputpartpage}[2]{
    \begin{tikzpicture}[remember picture, overlay]
    \node[anchor=center, rectangle, fill=ocre!20, inner sep=0pt, minimum height=\paperheight, minimum width=\paperwidth] at (current page.center) {}; % Background color
    \node[anchor=north west, inner sep=0pt, xshift=\Gm@lmargin, yshift=-\Gm@tmargin] at (current page.north west) {\fontsize{220pt}{220pt}\selectfont\sffamily\bfseries\textcolor{ocre!40}{#1}}; % Part number
    \node[anchor=north east, inner sep=0pt, xshift=-\Gm@rmargin, yshift=-\Gm@tmargin] at (current page.north east) {\fontsize{30pt}{30pt}\selectfont\sffamily\bfseries\textcolor{white}{\strut #2}}; % Part title
    \node[anchor=south east, inner sep=0pt, xshift=-\Gm@rmargin, yshift=\Gm@bmargin] at (current page.south east) { % Mini table of contents
        \parbox[t][][t]{8.5cm}{ % Width of box holding the mini ToC
            \printcontents[part]{l}{0}{\setcounter{tocdepth}{1}} % Display the mini table of contents showing chapters and sections, change tocdepth to 2 to also show subsections or 0 to only show chapters
        }
    };
    \end{tikzpicture}
}

\titleformat
{\part} % Section type being modified
[block] % Shape type, can be: hang, block, display, runin, leftmargin, rightmargin, drop, wrap, frame
{\startcontents[part]\outputpartpage{\thepart}{#1}} % Format of the whole section
{} % Format of the section label
{0em} % Space between the title and label
{} % Code before the label
[] % Code after the label

%-------------------------------------------

% Command to store the current chapter image to use for all future chapters, can be changed any time in the document and can be empty
\newcommand{\thechapterimage}{}
\newcommand{\chapterimage}[1]{\renewcommand{\thechapterimage}{#1}}

% Command to store the current whitespace above the chapter title box for all future chapters, can be changed at any time in the document
\newcommand{\thechapterspaceabove}{}
\newcommand{\chapterspaceabove}[1]{\renewcommand{\thechapterspaceabove}{#1}}

% Command to store the current whitespace below the chapter title box for all future chapters, can be changed at any time in the document
\newcommand{\thechapterspacebelow}{}
\newcommand{\chapterspacebelow}[1]{\renewcommand{\thechapterspacebelow}{#1}}

% Command to output the chapter title with optional background image
\newcommand{\outputchaptertitle}[2]{
    \begin{tikzpicture}[remember picture,overlay]
    % If a chapter image has been specified
    \expandafter\ifstrequal\expandafter{\thechapterimage}{}{}{
    % Output the chapter image
        \node[
            anchor=north west, % Anchor point on the image
            inner sep=0pt, % Inner padding
        ] at (current page.north west) {\includegraphics[width=\paperwidth]{\thechapterimage}};
    }
    % Box with the chapter title
    \draw[anchor=west] (current page.north west) node [
    anchor=north west, % Anchor point of the chapter box
    xshift=\Gm@lmargin, % Horizontal distance from the left side of the page
    yshift=-\thechapterspaceabove, % Vertical distance from the top of the page
    line width=2pt, % Border line thickness
    rounded corners=10pt, % Rounded corners amount
    draw=ocre, % Border line color
    fill=black!5, % Box background color
    fill opacity=0.6, % Background transparency
    text opacity=1, % Text transparency
    inner ysep=12.5pt, % Inner vertical padding
    inner xsep=20pt, % Inner horizontal padding
    align=flush left, % Text alignment inside box
    text width=1.2\linewidth, % Box width (wider than page to go off the right side)
    font=\huge\sffamily\bfseries, % Font styling for chapter title
    ] {\parbox{0.85\linewidth}{\strut\raggedright\expandafter\ifstrequal\expandafter{#1}{}{}{#1. }#2\vspace{-3pt}}}; % Chapter title in a fixed width box for wrapping
    \end{tikzpicture}
}

% Numbered chapters
\titleformat
{\chapter} % Section type being modified
[block] % Shape type, can be: hang, block, display, runin, leftmargin, rightmargin, drop, wrap, frame
{\outputchaptertitle{\thechapter}{#1}} % Format of the whole section
{} % Format of the section label
{0cm} % Space between the title and label
{} % Code before the label
[] % Code after the label

% Unnumbered chapters
\titleformat
{name=\chapter, numberless} % Section type being modified
[block] % Shape type, can be: hang, block, display, runin, leftmargin, rightmargin, drop, wrap, frame
{\outputchaptertitle{}{#1}} % Format of the whole section
{} % Format of the section label
{0cm} % Space between the title and label
{} % Code before the label
[] % Code after the label

\titlespacing*{\chapter}{0pt}{0pt}{\thechapterspacebelow} % Spacing around section titles, the order is: left, before and after

%-------------------------------------------

\titleformat
{\section} % Section type being modified
[block] % Shape type, can be: hang, block, display, runin, leftmargin, rightmargin, drop, wrap, frame
{\bfseries\sffamily\Large} % Format of the whole section
{\llap{\textcolor{ocre}{\thesection}\hspace{1em}}#1} % Format of the section label
{0cm} % Space between the title and label
{} % Code before the label
[] % Code after the label

\titleformat
{name=\section, numberless} % Section type being modified
[block] % Shape type, can be: hang, block, display, runin, leftmargin, rightmargin, drop, wrap, frame
{\bfseries\sffamily\Large} % Format of the whole section
{#1} % Format of the section label
{0cm} % Space between the title and label
{} % Code before the label
[] % Code after the label

\titlespacing*{\section}{0pt}{12pt}{6pt} % Spacing around section titles, the order is: left, before and after

%-------------------------------------------

\titleformat
{\subsection} % Section type being modified
[block] % Shape type, can be: hang, block, display, runin, leftmargin, rightmargin, drop, wrap, frame
{\bfseries\sffamily\large} % Format of the whole section
{\llap{\textcolor{ocre}{\thesubsection}\hspace{1em}}#1} % Format of the section label
{0cm} % Space between the title and label
{} % Code before the label
[] % Code after the label

\titleformat
{name=\subsection, numberless} % Section type being modified
[block] % Shape type, can be: hang, block, display, runin, leftmargin, rightmargin, drop, wrap, frame
{\bfseries\sffamily\large} % Format of the whole section
{#1} % Format of the section label
{0cm} % Space between the title and label
{} % Code before the label
[] % Code after the label

\titlespacing*{\subsection}{0pt}{12pt}{4pt} % Spacing around section titles, the order is: left, before and after

%-------------------------------------------

\titleformat
{\subsubsection} % Section type being modified
[block] % Shape type, can be: hang, block, display, runin, leftmargin, rightmargin, drop, wrap, frame
{\bfseries\sffamily} % Format of the whole section
{\llap{{\thesubsubsection}\hspace{1em}}#1} % Format of the section label
{0cm} % Space between the title and label
{} % Code before the label
[] % Code after the label

\titleformat
{name=\subsubsection, numberless} % Section type being modified
[block] % Shape type, can be: hang, block, display, runin, leftmargin, rightmargin, drop, wrap, frame
{\bfseries\sffamily} % Format of the whole section
{#1} % Format of the section label
{0cm} % Space between the title and label
{} % Code before the label
[] % Code after the label

\titlespacing*{\subsubsection}{0pt}{8pt}{4pt} % Spacing around section titles, the order is: left, before and after

%-------------------------------------------

\titleformat
{\paragraph} % Section type being modified
[runin] % Shape type, can be: hang, block, display, runin, leftmargin, rightmargin, drop, wrap, frame
{\bfseries\sffamily} % Format of the whole section
{} % Format of the section label
{0cm} % Space between the title and label
{#1} % Code before the label
[] % Code after the label

\titlespacing*{\paragraph}{0pt}{0pt}{6pt} % Spacing around section titles, the order is: left, before and after

%----------------------------------------------------------------------------------------
%	TABLE OF CONTENTS
%----------------------------------------------------------------------------------------

\usepackage{titletoc} % Required for manipulating the table of contents

\setcounter{tocdepth}{2} % Display down to subsections in the table of contents

\contentsmargin{0cm} % Removes the default right margin

%------------------------------------------------

% Styling of numbered parts in the table of contents
\newcommand{\tocentrypartnumbered}[1]{%
    \setlength\fboxsep{0pt}% Remove box padding
    \contentslabel[%
    % Part number box
        \colorbox{ocre!20}{% Background color
            \strut\parbox[c][.7cm]{1.1cm}{% Box size
                \color{ocre!70}\Large\sffamily\bfseries\centering\thecontentslabel% Part number
            }%
        }%
        \hspace{4pt}%
        % Part title box
        \colorbox{ocre!40}{% Background color
            \strut\parbox[c][.7cm]{\linewidth-1.25cm}{% Box size
                \centering\Large\sffamily #1% Part title
            }%
        }%
    ]{1.25cm}
}

% Styling of unnumbered parts in the table of contents
\newcommand{\tocentrypartunnumbered}[1]{%
    \setlength\fboxsep{0pt}% Remove box padding
    \contentslabel[%
    % Part title box
        \colorbox{ocre!40}{% Background color
            \strut\parbox[c][.7cm]{\linewidth}{% Box size
                \centering\Large\sffamily #1% Part title
            }%
        }%
    ]{1.25cm}
}

\titlecontents{part} % Section type being modified
[1.25cm] % Left indentation
{\addvspace{20pt}\Large\sffamily\bfseries\hypersetup{linkcolor=black}} % Before code
{\tocentrypartnumbered} % Formatting of numbered sections of this type
{\tocentrypartunnumbered} % Formatting of numberless sections of this type
{} % Formatting of the filler to the right of the heading and the page number
[] % After code

%------------------------------------------------

\titlecontents{chapter} % Section type being modified
[1.25cm] % Left indentation
{\addvspace{12pt}\large\sffamily\bfseries\hypersetup{linkcolor=ocre}} % Before code
{\color{ocre}\contentslabel[\Large\thecontentslabel]{1.25cm}} % Formatting of numbered sections of this type
{} % Formatting of numberless sections of this type
{\color{ocre!60}\normalsize\;\titlerule*[6pt]{.}\;\color{ocre}\thecontentspage} % Formatting of the filler to the right of the heading and the page number
[] % After code

%------------------------------------------------

\titlecontents{section} % Section type being modified
[1.25cm] % Left indentation
{\addvspace{3pt}\sffamily\bfseries} % Before code
{\contentslabel[\thecontentslabel]{1.25cm}} % Formatting of numbered sections of this type
{} % Formatting of numberless sections of this type
{~{\normalfont\titlerule*[6pt]{.}}~\thecontentspage} % Formatting of the filler to the right of the heading and the page number
[] % After code

%------------------------------------------------

\titlecontents{subsection} % Section type being modified
[1.25cm] % Left indentation
{\addvspace{1pt}\sffamily\small} % Before code
{\contentslabel[\thecontentslabel]{1.25cm}} % Formatting of numbered sections of this type
{} % Formatting of numberless sections of this type
{~\titlerule*[6pt]{.}~\thecontentspage} % Formatting of the filler to the right of the heading and the page number
[] % After code

%------------------------------------------------

\titlecontents{subsubsection} % Section type being modified
[1.75cm] % Left indentation
{\sffamily\small} % Before code
{\contentslabel[\thecontentslabel]{1.75cm}} % Formatting of numbered sections of this type
{} % Formatting of numberless sections of this type
{~\titlerule*[6pt]{.}~\thecontentspage} % Formatting of the filler to the right of the heading and the page number
[] % After code

%------------------------------------------------

% List of figures entries
\titlecontents{figure} % Section type being modified
[0cm] % Left indentation
{\addvspace{2pt}\sffamily\small} % Before code
{\thecontentslabel\hspace*{1em}} % Formatting of numbered sections of this type
{} % Formatting of numberless sections of this type
{~\titlerule*[6pt]{.}~\thecontentspage} % Formatting of the filler to the right of the heading and the page number
[] % After code

%------------------------------------------------

% List of tables entries
\titlecontents{table} % Section type being modified
[0cm] % Left indentation
{\addvspace{2pt}\sffamily\small} % Before code
{\thecontentslabel\hspace*{1em}} % Formatting of numbered sections of this type
{} % Formatting of numberless sections of this type
{~\titlerule*[6pt]{.}~\thecontentspage} % Formatting of the filler to the right of the heading and the page number
[] % After code

%------------------------------------------------

\titlecontents{lchapter} % Chapter headings on part pages
[0cm] % Left indentation
{\addvspace{12pt}\large\sffamily\bfseries\hypersetup{linkcolor=ocre}} % Before code
{\color{ocre}\contentslabel[\Large\thecontentslabel]{1.25cm}} % Formatting of numbered sections of this type
{\color{ocre}} % Formatting of numberless sections of this type
{~\color{ocre!60}\normalsize\titlerule*[6pt]{.}~\color{ocre}\thecontentspage} % Formatting of the filler to the right of the heading and the page number

%------------------------------------------------

\titlecontents{lsection} % Section headings on part pages
[0cm] % Left indentation
{\sffamily\small} % Before code
{\contentslabel[\thecontentslabel]{1.25cm}} % Formatting of numbered sections of this type
{} % Formatting of numberless sections of this type
{~{\normalfont\titlerule*[6pt]{.}}~\thecontentspage} % Formatting of the filler to the right of the heading and the page number

%------------------------------------------------

\titlecontents{lsubsection} % Subsection headings on part pages
[0cm] % Left indentation
{\sffamily\footnotesize} % Before code
{\contentslabel[\thecontentslabel]{1.25cm}\hspace{0.5cm}} % Formatting of numbered sections of this type
{} % Formatting of numberless sections of this type
{~{\normalfont\titlerule*[6pt]{.}}~\thecontentspage} % Formatting of the filler to the right of the heading and the page number

%----------------------------------------------------------------------------------------
%	BIBLIOGRAPHY - REMOVED (Using footnotes instead)
%----------------------------------------------------------------------------------------

% Bibliography package removed - using footnotes for citations

%----------------------------------------------------------------------------------------
%	INDEX - REMOVED (Using table of contents instead)
%----------------------------------------------------------------------------------------

% Index package removed - using table of contents for navigation

%----------------------------------------------------------------------------------------
%	 TABLES
%----------------------------------------------------------------------------------------

\usepackage{array} % Required for manipulating table elements

\newcolumntype{R}[1]{>{\raggedleft\arraybackslash}p{#1}} % Define a new right-aligned paragraph column type
\newcolumntype{L}[1]{>{\raggedright\arraybackslash}p{#1}} % Define a new left-aligned (no justification) paragraph column type
\newcolumntype{C}[1]{>{\centering\arraybackslash}p{#1}} % Define a new centered paragraph column type

\usepackage{booktabs} % Required for high quality horizontal rules in tables

%----------------------------------------------------------------------------------------
%	 LISTS
%----------------------------------------------------------------------------------------

\usepackage{enumitem} % Required for list customization

\setlist{nolistsep, noitemsep} % Customize spacing inside and outside lists

\renewcommand{\labelenumi}{\arabic{enumi}.} % Customize the first level numbered list characters
\renewcommand{\labelenumii}{\alph{enumii}.} % Customize the second level numbered list characters
\renewcommand{\labelenumiii}{\roman{enumiii}.} % Customize the third level numbered list characters

%------------------------------------------------

\renewcommand{\labelitemi}{\raisebox{-2pt}{\Large \textbullet}} % Customize the first level bullet point character
\renewcommand{\labelitemii}{--} % Customize the second level bullet point character
\renewcommand{\labelitemiii}{$\circ$} % Customize the third level bullet point character

%----------------------------------------------------------------------------------------
%	LINKS
%----------------------------------------------------------------------------------------

\usepackage{hyperref}

\hypersetup{
    colorlinks=true, % Whether to color links (a thin box is output around links if this is false)
%hidelinks, % Hide the default boxes around links
    urlcolor=ocre, % Color for \url and \href links
    linkcolor=black, % Color for \ref/\nameref links
    linktoc=all, % Link from section names and page numbers in the table of contents
}

%----------------------------------------------------------------------------------------
%	BOOKMARKS
%----------------------------------------------------------------------------------------

\usepackage{bookmark} % Required for customizing PDF bookmarks

\bookmarksetup{
    open, % Open all bookmark drawers automatically
    numbered, % Add section numbers to bookmarks
    addtohook={%
        \ifnum
            \bookmarkget{level}=-1 % Customize part bookmarks
            \bookmarksetup{color=ocre, bold}% Bold and colored
        \fi
        \ifnum
            \bookmarkget{level}=0 % Customize chapter bookmarks
            \bookmarksetup{bold}% Bold
        \fi
    }
}

%----------------------------------------------------------------------------------------
%	TITLE PAGE
%----------------------------------------------------------------------------------------

\renewcommand{\titlepage}[2]{
    \thispagestyle{empty} % Suppress headers and footers on the title page

    \begin{tikzpicture}[remember picture, overlay]
		\node [inner sep=0pt] at (current page.center) {#1}; % Background image
        %\node [anchor=center, inner sep=1.25cm, rectangle, fill=ocre!30!white, fill opacity=0.6, text opacity=1, minimum height=0.2\paperheight, minimum width=\paperwidth, text width=0.8\paperwidth] at (current page.center) {#2}; % Title highlight box with title(s) and author(s)
    \end{tikzpicture}

    \newpage
}

%----------------------------------------------------------------------------------------
%	THEOREM STYLES
%----------------------------------------------------------------------------------------

\usepackage{amsmath, amsfonts, amssymb, amsthm} % For math equations, theorems, symbols, etc

\renewcommand{\qedsymbol}{$\blacksquare$} % Redefine the QED symbol to be a filled square vs. the default unfilled square

%------------------------------------------------

% Orange theorem number and optional black title with padding above and below
\newtheoremstyle{ocrenum} % Theorem style name
{6pt} % Space above
{6pt} % Space below
{\normalfont} % Body font
{} % Indent amount
{} % Theorem head font
{} % Punctuation after theorem head
{0.25em} % Space after theorem head
{\small\sffamily\bfseries\color{ocre}\thmname{#1}~\thmnumber{\@ifnotempty{#1}{}\@upn{#2}} % Theorem text (e.g. Theorem 2.1)
\thmnote{\the\thm@notefont\sffamily\bfseries\color{black}---~#3.\hspace{0.25em}}} % Optional theorem note

%------------------------------------------------

% Orange theorem number and optional black title with no padding above and below
\newtheoremstyle{ocrenumbox} % Theorem style name
{0pt} % Space above
{0pt} % Space below
{\normalfont} % Body font
{} % Indent amount
{} % Theorem head font
{} % Punctuation after theorem head
{0.25em} % Space after theorem head
{\small\sffamily\bfseries\color{ocre}\thmname{#1}~\thmnumber{\@ifnotempty{#1}{}\@upn{#2}} % Theorem text (e.g. Theorem 2.1)
\thmnote{\the\thm@notefont\sffamily\bfseries\color{black}---~#3.\hspace{0.25em}}} % Optional theorem note

%------------------------------------------------

% Black theorem number and optional black title no padding above and below
\newtheoremstyle{blacknumex} % Theorem style name
{6pt} % Space above
{6pt} % Space below
{\normalfont} % Body font
{} % Indent amount
{} % Theorem head font
{} % Punctuation after theorem head
{0.25em} % Space after theorem head
{\small\sffamily\bfseries{\raisebox{1.25pt}{\tiny\ensuremath{\blacksquare}}}~\thmname{#1}~\thmnumber{\@ifnotempty{#1}{}\@upn{#2}} % Theorem text (e.g. Theorem 2.1)
\thmnote{\the\thm@notefont\sffamily\bfseries---~#3.\hspace{0.25em}}} % Optional theorem note

% Like blacknumex, but the text starts on the line below the heading (used by example)
\newtheoremstyle{blacknumexnl} % Theorem style name
{6pt} % Space above
{6pt} % Space below
{\normalfont} % Body font
{} % Indent amount
{} % Theorem head font
{} % Punctuation after theorem head
{\newline} % Space after theorem head
{\small\sffamily\bfseries{\raisebox{1.25pt}{\tiny\ensuremath{\blacksquare}}}~\thmname{#1}~\thmnumber{\@ifnotempty{#1}{}\@upn{#2}} % Theorem text (e.g. Theorem 2.1)
\thmnote{\the\thm@notefont\sffamily\bfseries---~#3.\hspace{0.25em}}} % Optional theorem note

%------------------------------------------------

% Black theorem number and optional black title padding above and below
\newtheoremstyle{blacknumbox} % Theorem style name
{0pt} % Space above
{0pt} % Space below
{\normalfont} % Body font
{} % Indent amount
{} % Theorem head font
{} % Punctuation after theorem head
{0.25em} % Space after theorem head
{\small\sffamily\bfseries\thmname{#1}~\thmnumber{\@ifnotempty{#1}{}\@upn{#2}} % Theorem text (e.g. Theorem 2.1)
\thmnote{\the\thm@notefont\sffamily\bfseries---~#3.\hspace{0.25em}}} % Optional theorem note

%------------------------------------------------

% Set the theorem style for each type of theorem-like environment by placing it under the theorem style you would like to use for it

% Nombres de los entornos: ingles por defecto; el principal en espanol los redefine ANTES de \documentclass
\providecommand{\LOBPropositionname}{Proposition}
\providecommand{\LOBTheoremname}{Theorem}
\providecommand{\LOBProblemname}{Problem}
\providecommand{\LOBExercisename}{Exercise}
\providecommand{\LOBExamplename}{Example}
\providecommand{\LOBNotationname}{Notation}
\providecommand{\LOBVocabularyname}{Vocabulary}
\providecommand{\LOBDefinitionname}{Definition}
\providecommand{\LOBCorollaryname}{Corollary}

% Orange theorem number and optional black title with padding above and below
\theoremstyle{ocrenum}
\newtheorem{proposition}{\LOBPropositionname}[chapter] % Propositions, the first argument is the theorem name, the second the theorem title used before the number and the third optional argument is whether to number under chapters (e.g. 2.1) or sections (e.g. 2.1.1)

% Orange theorem number and optional black title with no padding above and below
\theoremstyle{ocrenumbox}
\newtheorem{theoremeT}{\LOBTheoremname}[chapter] % Theorems, the first argument is the theorem name, the second the theorem title used before the number and the third optional argument is whether to number under chapters (e.g. 2.1) or sections (e.g. 2.1.1)
\newtheorem{problem}{\LOBProblemname}[chapter] % Problems, the first argument is the theorem name, the second the theorem title used before the number and the third optional argument is whether to number under chapters (e.g. 2.1) or sections (e.g. 2.1.1)
\newtheorem{exerciseT}{\LOBExercisename}[chapter] % Exercises, the first argument is the theorem name, the second the theorem title used before the number and the third optional argument is whether to number under chapters (e.g. 2.1) or sections (e.g. 2.1.1)

% Black theorem number and optional black title no padding above and below
\theoremstyle{blacknumexnl}
\newtheorem{exampleT}{\LOBExamplename}[chapter] % Examples, the first argument is the theorem name, the second the theorem title used before the number and the third optional argument is whether to number under chapters (e.g. 2.1) or sections (e.g. 2.1.1)
\theoremstyle{blacknumex}
\newtheorem{notation}{\LOBNotationname}[chapter] % Notations, the first argument is the theorem name, the second the theorem title used before the number and the third optional argument is whether to number under chapters (e.g. 2.1) or sections (e.g. 2.1.1)
\newtheorem{vocabulary}{\LOBVocabularyname}[chapter] % Vocabularies, the first argument is the theorem name, the second the theorem title used before the number and the third optional argument is whether to number under chapters (e.g. 2.1) or sections (e.g. 2.1.1)

% Black theorem number and optional black title with padding above and below
\theoremstyle{blacknumbox}
\newtheorem{definitionT}{\LOBDefinitionname}[chapter] % Definitions, the first argument is the theorem name, the second the theorem title used before the number and the third optional argument is whether to number under chapters (e.g. 2.1) or sections (e.g. 2.1.1)
\newtheorem{corollaryT}{\LOBCorollaryname}[chapter] % Corollaries, the first argument is the theorem name, the second the theorem title used before the number and the third optional argument is whether to number under chapters (e.g. 2.1) or sections (e.g. 2.1.1)

%----------------------------------------------------------------------------------------
%	COLORED THEOREM BOXES
%----------------------------------------------------------------------------------------

\RequirePackage[framemethod=default]{mdframed} % Required for creating colored boxes used for theorems, definitions, exercises and corollaries

% Theorem box
\newmdenv[
    skipabove=7pt, % Whitespace above box
    skipbelow=7pt, % Whitespace below box
    backgroundcolor=black!5, % Background color
    linecolor=ocre, % Border color
    innerleftmargin=5pt, % Inside left margin width
    innerrightmargin=5pt, % Inside right margin width
    innertopmargin=5pt, % Inside top margin height
    innerbottommargin=5pt, % Inside bottom margin height
    leftmargin=0cm, % Outside left margin width
    rightmargin=0cm % Outside right margin width
]{tBox}

% Exercise box
\newmdenv[
    skipabove=7pt, % Whitespace above box
    skipbelow=7pt, % Whitespace below box
    rightline=false, % Right line visible
    leftline=true, % Left line visible
    topline=false, % Top line visible
    bottomline=false, % Bottom line visible
    linecolor=ocre, % Line color
    linewidth=4pt, % Line width
    backgroundcolor=ocre!10, % Background color
    innerleftmargin=5pt, % Inside left margin width
    innerrightmargin=5pt, % Inside right margin width
    innertopmargin=5pt, % Inside top margin height
    innerbottommargin=5pt, % Inside bottom margin height
    leftmargin=0cm, % Outside left margin width
    rightmargin=0cm % Outside right margin width
]{eBox}

% Definición de Box para las soluciones
\newmdenv[
    skipabove=7pt,
    skipbelow=7pt,
    rightline=false,
    leftline=true,
    topline=false,
    bottomline=false,
    linecolor=ocre,
    linewidth=4pt,
    %backgroundcolor=ocre!5,  % Sin color de fondo
    innerleftmargin=5pt,
    innerrightmargin=5pt,
    innertopmargin=5pt,
    innerbottommargin=5pt,
    leftmargin=0cm,
    rightmargin=0cm
]{solBox}


% Definition box
\newmdenv[
skipabove=7pt, % Whitespace above box
skipbelow=7pt, % Whitespace below box
rightline=false, % Right line visible
leftline=true, % Left line visible
topline=false, % Top line visible
bottomline=false, % Bottom line visible
linecolor=ocre, % Border color
linewidth=4pt, % Border width
innerleftmargin=5pt, % Inside left margin width
innerrightmargin=5pt, % Inside right margin width
innertopmargin=0pt, % Inside top margin height
innerbottommargin=0pt, % Inside bottom margin height
leftmargin=0cm, % Outside left margin width
rightmargin=0cm, % Outside right margin width
backgroundcolor=ocre!3 % ← aquí está la clave
]{dBox}

% Corollary box
\newmdenv[
    skipabove=7pt, % Whitespace above box
    skipbelow=7pt, % Whitespace below box
    rightline=false, % Right line visible
    leftline=true, % Left line visible
    topline=false, % Top line visible
    bottomline=false, % Bottom line visible
    linecolor=gray, % Line color
    linewidth=4pt, % Line width
    backgroundcolor=black!5, % Background color
    innerleftmargin=5pt, % Inside left margin width
    innerrightmargin=5pt, % Inside right margin width
    innertopmargin=5pt, % Inside top margin height
    innerbottommargin=5pt, % Inside bottom margin height
    leftmargin=0cm, % Outside left margin width
    rightmargin=0cm % Outside right margin width
]{cBox}

% Creates an environment for each type of theorem and assigns it a theorem text style from the THEOREM STYLES block above and a colored box from above
\newenvironment{theorem}{\begin{tBox}\begin{theoremeT}}{\end{theoremeT}\end{tBox}}
\newenvironment{exercise}{\begin{eBox}\begin{exerciseT}}{\hfill{\color{ocre}\tiny\ensuremath{\blacksquare}}\end{exerciseT}\end{eBox}}
\newenvironment{definition}{\begin{dBox}\begin{definitionT}}{\end{definitionT}\end{dBox}}
\newenvironment{example}{\begin{exampleT}}{\hfill{\tiny\ensuremath{\blacksquare}}\end{exampleT}}
\newenvironment{corollary}{\begin{cBox}\begin{corollaryT}}{\end{corollaryT}\end{cBox}}

%----------------------------------------------------------------------------------------
%	REMARK ENVIRONMENT
%----------------------------------------------------------------------------------------

\newenvironment{remark}{%
    \par\small % Reduce font size for remarks
    \vspace{4pt} % Vertical whitespace
    \begin{adjustwidth}{35pt}{25pt} % Left and right padding
    \hspace{-2.5pt}%
    \begin{tikzpicture}[overlay]
    \node[draw=ocre!60,line width=1pt,circle,fill=ocre!25,font=\sffamily\bfseries,inner sep=3pt,outer sep=0pt] at (-15pt,0pt){\textcolor{ocre}{R}}; % Orange R in a circle
    \end{tikzpicture}
    \advance\baselineskip -1pt% Reduce line spacing
}{%
    \end{adjustwidth}
}

%----------------------------------------------------------------------------------------
%	 LOAD PACKAGES THAT CLASH WITH OTHER PACKAGES
%----------------------------------------------------------------------------------------

\usepackage{tikz} % Required for drawing custom shapes and positioning elements absolutely on the page



% Mis últimos cambios 22/05/2024
%
%\RequirePackage{xstring}
%
%\usepackage{etoolbox}
%
%\RequirePackage{ifthen}
%
%\usepackage{color}
%
%\usepackage{xcolor}
%
%\usepackage{subfiles}
%
%\usepackage{wrapfig}    % Para usar wrapfigure
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% SOBRE MATEMÁTICAS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\RequirePackage{amsmath}
%
%\RequirePackage{mathtools}
%
%\RequirePackage{amsfonts}
%
%\RequirePackage{amssymb}
%
%\RequirePackage{bm} % Para poner negrita en fórmulas
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% tablas y encabezados
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\RequirePackage{tabularray}
%
%\UseTblrLibrary{amsmath}
%
%\usepackage{booktabs} % para usar el midrule
%
%\RequirePackage{fancyhdr}
%
%\RequirePackage{enumitem} % paquete para listas y cambiar la etiqueta
%
%
%
%\RequirePackage{pdflscape}
%
%\RequirePackage{pdfpages} %! para incluir pdfs
%
%\RequirePackage{dashrule} %! para poner líneas punteadas fácilmente
%
%
%
%\RequirePackage{setspace} % Para establecer el espacio , se hace con \spacing{1.2}
%
%\RequirePackage{paracol}
%
%
%
%
%
%\RequirePackage{cancel}
%
%\RequirePackage{multicol}
%
%\usepackage[spanish=mexican]{csquotes} %para las comillas
%
%\RequirePackage{epsfig} %para pasar a eps a pdf
%
%%\RequirePackage{mathpazo}
%
%\usepackage{lastpage} %Se necesita para la última página.
%
%\usepackage{fancyhdr}
%
%\RequirePackage{euler}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% TIKZ y librería
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\RequirePackage{tikz}
%\usetikzlibrary{matrix,arrows, positioning,shadows,shadings,backgrounds,
%    calc, shapes, tikzmark}
%
%\RequirePackage{endiagram}
%
%\RequirePackage{varwidth} % Se necesita para algunos tcolorbox
%
%\RequirePackage{annotate-equations} %Hacer anotaciones en las ecuaciones.
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% SOBRE FIGURAS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\usepackage{graphicx}
%
%%\RequirePackage{subfig} %para poner varias imágenes juntas con subfloat
%\RequirePackage{subcaption}
%
%\RequirePackage{float}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% VARIOS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\RequirePackage{upgreek} %! Importante, leer la documentación de chemmacros para esto.
%
%\RequirePackage{fontawesome}
%
%\RequirePackage{schemata}
%
%\RequirePackage{hyperref}
%\hypersetup{%
%    colorlinks=true,
%    linkcolor = darkblue
%%urlcolor=myOrange3
%}
%
%\RequirePackage{xparse}
%
%
%\RequirePackage[normalem]{ulem}
%
%\RequirePackage{soul}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% SOBRE QUÍMICA
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\RequirePackage{chemfig}
%
%\RequirePackage{lewis}
%
%\usepackage{siunitx}
%
%\RequirePackage{chemmacros}
%\chemsetup[redox]{
%    format=\tiny,
%    format=\color{red},
%    explicit-sign = true,
%    pos=top,
%    roman=false}
%\chemsetup[reactions]{before-tag = R\textbf,
%    tag-open = [,
%    tag-close = ],
%    list-name = {Lista de Reacciones},
%    list-entry = {Reacción},
%}
%
%
%\NewChemEqConstant\Kh{K-hydrolisis}{\mathrm{h}}
%\NewChemEqConstant\Kp{K-pressure}{\mathrm{p}}
%\NewChemEqConstant\Kc{K-concentration}{\mathrm{c}}
%\NewChemEqConstant\Kx{K-molarfraction}{\mathrm{x}}
%\NewChemEqConstant\Kps{K-solubility}{\mathrm{ps}}
%
%
%\usepackage{pgfplots}
%
%\pgfplotsset{width=10cm,compat=1.9}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Variados
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\usepackage{textcomp}
%
%\usepackage{makecell}
%%----------------------------------------------------------------------------------------
%%	 Comandos Propios
%%----------------------------------------------------------------------------------------
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\newbool{soluciones}
%\NewDocumentEnvironment{soluciones}{+b}
%{\ifbool{soluciones}{\begin{solucion}
%#1
%\end{solucion}}{}}{}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Para las listas
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\newcommand{\cnumero}[2]{\tikz[baseline=(myanchor.base)]
%\node[minimum size=0.2cm,circle,
%    inner sep=1pt,draw, #2,thick,fill=#2] (myanchor)
%{\color{white}\bfseries\fontsize{8}{8}#1};}
%
%\newcommand{\numerocirculo}[2]{\tikz[baseline=(myanchor.base)]
%\node[minimum size=0.2cm,circle,
%    inner sep=1pt,draw, #2,thick,fill=#2] (myanchor)
%{\color{white}\bfseries\fontsize{8}{8}#1};}
%
%\newcommand*{\itembolasazules}[1]{\protect\cnumero{#1}{azulF}}
%\newcommand*{\itembolascolor}[2]{\protect\cnumero{#1}{#2}}
%\newcommand*{\numberballgreen}{\protect\cnumero{\arabic*}{mygreen}}
%\newcommand*{\numberballblue}{\protect\cnumero{\arabic*}{blue}}
%\newcommand*{\numberballred}{\protect\cnumero{\arabic*}{red}}
%
%\newcommand*{\numberballmDarkTeal}{\protect\cnumero{\arabic*}{mDarkTeal}}
%\newcommand*{\numberballmDarkBrown}{\protect\cnumero{\arabic*}{mDarkBrown}}
%\newcommand*{\numberballmLightBrown}{\protect\cnumero{\arabic*}{mLightBrown}}
%\newcommand*{\numberballmLightGreen}{\protect\cnumero{\arabic*}{mLightGreen}}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% MIS Comandos Generales
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\newcommand{\blueremark}[1]{%
%    \textcolor{blue}{\texttt{\textbf{#1}}}
%}
%
%\newcommand{\rojo}[1]{\textcolor{red}{#1}}
%
%\newcommand{\rojon}[1]{\textbf{\textcolor{red}{#1}}}
%
%\newcommand{\azul}[1]{\textcolor{blue}{#1}}
%
%\newcommand{\azuln}[1]{\textbf{\textcolor{blue}{#1}}}
%
%\newcommand{\verde}[1]{\textcolor{green!50!black}{#1}}
%
%\newcommand{\verden}[1]{\textbf{\textcolor{green!50!black}{#1}}}
%
%\newcommand{\caja}[1]{\begin{center}%
%\begin{impt}%
%#1
%\end{impt}
%\end{center}}
%
%\newcommand{\separ}{\\[2mm]}
%
%\newcounter{ejercicionumero}
%\setcounter{ejercicionumero}{0}
%
%\newcounter{ejemplo}
%\setcounter{ejemplo}{0}
%
%\newcounter{ejerciciogeneral}
%\setcounter{ejerciciogeneral}{0}
%
%
%%\newcommand{\ejercicio}[1]{\noindent\xmybox{\phantom{l}\textbf{\addtocounter{ejerciciogeneral}{1}\arabic{ejerciciogeneral} #1}\phantom{j}}}
%
%\newcommand{\ejerciciogeneral}[1]{\noindent\xmybox{\phantom{l}\textbf{Ejercicio \addtocounter{ejerciciogeneral}{1}\arabic{ejerciciogeneral} #1}\phantom{j}}}
%
%\newcommand{\ejerciciogeneralcapitulo}[1]{\noindent\xmybox{\phantom{l}\textbf{Ejercicio \addtocounter{ejerciciogeneral}{1}\thechapter.\arabic{ejerciciogeneral} #1}\phantom{j}}}
%
%\newcommand{\mybox}[1]{\noindent\xmybox{\phantom{l}\textbf{\addtocounter{ejercicionumero}{1}\arabic{ejercicionumero} #1}\phantom{j}}}
%\newcommand{\myboxcapitulo}[1]{\noindent\xmybox{\phantom{l}\textbf{\addtocounter{ejercicionumero}{1}\thechapter.\arabic{ejercicionumero} #1}\phantom{j}}}
%
%
%\newcommand{\ejer}[1]{\xmybox{\phantom{l} #1 \phantom{j}}}
%
%
%\newcommand{\marcador}[1]{\colorbox{yellow}{#1}}
%
%\newcommand{\negrita}[1]{\textbf{#1}}
%\newcommand{\subin}[1]{\textsubscript{#1}}
%\newcommand{\supin}[1]{\textsuperscript{#1}}
%\newcommand{\negsubro}[1]{\negrita{\coloruline{red}{#1}}}
%
%\newcommand{\letramayuscula}{\Alph*)}
%\newcommand{\letraminuscula}{\textit{\textbf{\alph*})}}
%
%\newcommand\myemptypage{
%    \null
%    \thispagestyle{empty}
%    \addtocounter{page}{-1}
%    \newpage
%} %comando para tener la página en blanco
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% PARA SUBRAYAR REquiere paquete ulem
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5
%\makeatletter
%\newcommand{\coloruline}[2]{%
%    \newcommand\temp@reduline{\bgroup\markoverwith
%    {\textcolor{#1}{\rule[-0.5ex]{2pt}{0.4pt}}}\ULon}%
%    \temp@reduline{#2}%
%}
%
%\newcommand{\coloruuline}[2]{%
%    \UL@protected\def\temp@uuline{\leavevmode \bgroup
%    \UL@setULdepth
%        \ifx
%            \UL@on\UL@onin \advance\ULdepth2.8\p@
%        \fi
%        \markoverwith{\textcolor{#1}{\lower\ULdepth\hbox
%        {\kern-.03em\vbox{\hrule width.2em\kern1\p@\hrule}\kern-.03em}}}%
%        \ULon}%
%    \temp@uuline{#2}%
%}
%
%\newcommand{\coloruwave}[2]{%
%    \UL@protected\def\temp@uwave{\leavevmode \bgroup
%        \ifdim
%            \ULdepth=\maxdimen \ULdepth 3.5\p@
%        \else
%            \advance\ULdepth2\p@
%        \fi \markoverwith{\textcolor{#1}{\lower\ULdepth\hbox{\sixly \char58}}}\ULon}
%    \font\sixly=lasy6 % does not re-load if already loaded, so no memory drain.
%    \temp@uwave{#2}%
%}
%\makeatother
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% para hacer cancelto en rojo
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\let\cancelorigcolor\CancelColor% Just for conveniency...
%
%\newcommand{\CancelTo}[3][]{%
%    \ifblank{#1}{}{%
%        \renewcommand{\CancelColor}{#1}%
%    }
%    \cancelto{#2}{#3}%
%}
%
%
%\newcommand{\canceltored}[2]{\CancelTo[\color{red}]{#1}{#2}}
%
%\newcommand\cancelred[1]{\renewcommand\CancelColor{\color{red}}\cancel{#1}}
%
%
%\newcounter{problema}
%\setcounter{problema}{0}
%\newcommand{\problema}[1]{\noindent\xmyboxorange{\phantom{l}\textbf{\addtocounter{problema}{1}\arabic{problema} #1}\phantom{j}}}
%
%\newcommand{\ejercicioxmybox}[2]{\noindent\xmybox{\bfseries #1 Página #2}} %xmybox está en tcolorbox definida. Es para los ejercicos, indicando el ejercicio y la página.
%
%%\newcommand{\mybox}[1]{\noindent\xmybox{\phantom{l}\textbf{#1}\phantom{j}}}
%
%%\newcommand{\solution}[1]{\textcolor{red}{\textbf{\ul{Solución:} #1}}}
%
%\newcommand{\solution}[1]{{\color{red}{\negrita{\ul{Solución:}} #1}}}
%
%\newcommand{\datos}{\textbf{\ul{Datos:}}}
%
%
%\newcommand{\ayuda}{\textbf{\ul{Ayuda:}}}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% EXÁMENES
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5
%
%
%\newcounter{preg}
%\setcounter{preg}{1}
%% \newcommand{\electron}{$e^-$}
%
%\newcommand{\ejercicio}{\noindent\negsubro{Ejercicio} \textbf{\negsubro{\arabic{preg}}\addtocounter{preg}{1}}\textbf{}}
%
%\newcommand{\ejercicioexamen}[2][10]{\noindent\ejercicio{} [\textbf{#1}]. \textbf{#2}}
%
%\newcommand{\exerciselocal}{\noindent\negsubro{Exercise} \textbf{\negsubro{\arabic{preg}}\addtocounter{preg}{1}}\textbf{}}
%
%\newcommand{\examexercise}[2][10]{\noindent\exerciselocal{} [\textbf{#1}]. \textbf{#2}}
%
%
%
%
%
%\newcommand{\negsub}[1]{\textbf{\underline{#1}}}
%
%
%
%\newcounter{cuestion}
%\setcounter{cuestion}{0}
%
%\newcounter{ejercicio}
%
%\newcommand{\cuestion}[1]{\noindent\xmybox{\phantom{l}\textbf{Cuestión \addtocounter{cuestion}{1}\arabic{cuestion} #1}\phantom{j}}}
%\newcommand{\cuestioncapitulo}[1]{\noindent\xmybox{\phantom{l}\textbf{Cuestión \addtocounter{cuestion}{1}\thechapter.\arabic{cuestion} #1}\phantom{j}}}
%
%
%\newcommand{\cmmnt}[1]{\ignorespaces} % para comentar palabras en un texto.
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% PARA ESQUEMAS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
%\newcommand\esquema[2]{\schema{\schemabox{#1}}{\schemabox{#2}}}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Para las soluciones
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\usepackage{versions}
%
%\newcommand{\consoluciones}{
%    \includeversion{profesor}
%
%    \excludeversion{estudiante}
%}
%
%\newcommand{\sinsoluciones}{
%    \excludeversion{profesor}
%
%    \includeversion{estudiante}
%}
%
%%\consoluciones{}
%%\sinsoluciones{}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% TCOLORBOX CAJAS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\RequirePackage[breakable, theorems]{tcolorbox}
%\tcbuselibrary{skins}
%
%\tcbset{opteqA/.style={ %
%tcbox % se aplica a tcbox , importante
%raise base,
%nobeforeafter,
%extrude by=-1mm,
%colback=white,
%colframe=red}}
%
%\newtcbox{\xmybox}[1][green]{on line,
%    arc=7pt,colback=#1!10!white,colframe=#1!50!black,
%    before upper={\rule[1pt]{0pt}{10pt}},boxrule=1pt,
%    boxsep=0pt,left=6pt,right=6pt,top=2pt,bottom=2pt}
%
%\newtcolorbox{impt}[1][]{breakable,
%    enhanced,
%    left=8mm,
%    right=8mm,
%    boxrule=0.8pt,
%    colback=red!5!white,
%    colframe=red!75!black,fonttitle=\bfseries,
%    fonttitle=\bfseries,
%    center title,
%    title={},
%    lifted shadow={1mm}{-2mm}{3mm}{0.1mm}{black!50!white},
%    leftrule=1.5mm,
%    width=0.8\textwidth
%    #1
%}
%
%\newtcolorbox{solucion}[1][]{enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=black!1,colbacktitle=blue!80, colframe=blue!90,boxrule=0.2mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!60!black,right color=tcbcolback!60!black,
%            middle color=tcbcolback!80!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    title=Solución,
%    #1}
%%title={#2},#1}
%
%\newtcolorbox{solucioneng}[1][]{enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=black!1,colbacktitle=blue!80, colframe=blue!90,boxrule=0.2mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!60!black,right color=tcbcolback!60!black,
%            middle color=tcbcolback!80!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    title=Solution,
%    #1}
%%title={#2},#1}
%
%
%
%\newtcolorbox{marker}[1][]{enhanced,
%    before skip balanced=2mm,after skip balanced=3mm,
%    boxrule=0.4pt,left=5mm,right=2mm,top=1mm,bottom=1mm,
%    colback=yellow!50,
%    colframe=yellow!20!black,
%    sharp corners,rounded corners=southeast,arc is angular,arc=3mm,
%    underlay={%
%        \path[fill=tcbcolback!80!black] ([yshift=3mm]interior.south east)--++(-0.4,-0.1)--++(0.1,-0.2);
%        \path[draw=tcbcolframe,shorten <=-0.05mm,shorten >=-0.05mm] ([yshift=3mm]interior.south east)--++(-0.4,-0.1)--++(0.1,-0.2);
%        \path[fill=yellow!50!black,draw=none] (interior.south west) rectangle node[white]{\Huge\bfseries !} ([xshift=4mm]interior.north west);
%    },
%    drop fuzzy shadow,#1}
%
%
%
%
%\newtcolorbox{correccion}[1][]{enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=black!1,colbacktitle=red, colframe=red,boxrule=0.2mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!60!black,right color=tcbcolback!60!black,
%            middle color=tcbcolback!80!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    title=Criterios de corrección,
%    #1}
%%title={#2},#1}
%
%\newtcolorbox[auto counter,number within=section]{problemas}[1][]{colback=orange!1!white,colframe=orange!75!black, breakable, title=Problemas}
%
%\newtcbox{\xmyboxorange}[1][orange]{on line,
%    arc=7pt,colback=#1!10!white,colframe=#1!50!black,
%    before upper={\rule[1pt]{0pt}{10pt}},boxrule=1pt,
%    boxsep=0pt,left=6pt,right=6pt,top=2pt,bottom=2pt}
%
%\newtcolorbox{ejemplosinsombra}[1][]{enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=black!1,colbacktitle=green!65!black, colframe=green!65!black,boxrule=0.2mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!60!black,right color=tcbcolback!60!black,
%            middle color=tcbcolback!80!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    before title={\stepcounter{ejemplo}},
%    title=Ejemplo~\thesection.\theejemplo,
%    #1}
%
%\newtcolorbox{ejemplo}[1][]{width=\textwidth,lifted shadow={1mm}{-2mm}{3mm}{0.1mm}%
%        {black!50!white},enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=black!1,colbacktitle=green!65!black, colframe=green!65!black,boxrule=0.5mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!80!black,right color=tcbcolback!80!black,
%            middle color=tcbcolback!90!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    before title={\stepcounter{ejemplo}},
%    title=Ejemplo~\thesection.\theejemplo,
%    #1}
%%title={#2},#1}
%%
%
%\newtcolorbox{ejemploamarillo}[2][]{width=\textwidth,lifted shadow={1mm}{-2mm}{3mm}{0.1mm}%
%        {black!50!white},enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=yellow!5!white,colbacktitle=yellow!75!black, colframe=yellow!75!black,boxrule=0.5mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!80!black,right color=tcbcolback!80!black,
%            middle color=tcbcolback!90!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    title=Ejemplo~\thesection.\theejemplo
%    #1}
%%title={#2},#1}
%
%\newtcolorbox{yellowexample}[2][]{width=\textwidth,lifted shadow={1mm}{-2mm}{3mm}{0.1mm}%
%        {black!50!white},enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=yellow!5!white,colbacktitle=yellow!75!black, colframe=yellow!75!black,boxrule=0.5mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!80!black,right color=tcbcolback!80!black,
%            middle color=tcbcolback!90!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    title=Example~\thesection.\theejemplo
%    #1}
%%title={#2},#1}
%
%\newtcolorbox{ejercicios}[1][]{width=\textwidth,lifted shadow={1mm}{-2mm}{3mm}{0.1mm}%
%        {black!50!white},enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=black!1,colbacktitle=green!65!black, colframe=green!65!black,boxrule=0.5mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!80!black,right color=tcbcolback!80!black,
%            middle color=tcbcolback!90!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    before title={\stepcounter{ejemplo}},
%    title=Ejercicios,
%    #1}
%%title={#2},#1}
%%
%
%\newtcolorbox{exercises}[1][]{width=\textwidth,lifted shadow={1mm}{-2mm}{3mm}{0.1mm}%
%        {black!50!white},enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=black!1,colbacktitle=green!65!black, colframe=green!65!black,boxrule=0.5mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!80!black,right color=tcbcolback!80!black,
%            middle color=tcbcolback!90!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    before title={\stepcounter{ejemplo}},
%    title=Exercises,
%    #1}
%%title={#2},#1}
%%
%
%\newtcolorbox{examplelocal}[1][]{width=\textwidth,lifted shadow={1mm}{-2mm}{3mm}{0.1mm}%
%        {black!50!white},enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=black!1,colbacktitle=green!65!black, colframe=green!65!black,boxrule=0.5mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!80!black,right color=tcbcolback!80!black,
%            middle color=tcbcolback!90!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    before title={\stepcounter{ejemplo}},
%    title=Example~\thesection.\theejemplo,
%    #1}
%
%%\newtcolorbox{definitionb}[2][]{colback=red!5!white,
%%colframe=red!75!black,fonttitle=\bfseries,
%%colbacktitle=red!75!black,
%%enhanced,
%%attach boxed title to top left ={xshift=3mm,yshift=-3mm},
%%title={Definition of #2},#1}
%%
%%
%%\newtcolorbox{definition}[2][]{width=\textwidth,lifted shadow={1mm}{-2mm}{3mm}{0.1mm}%
%%{black!50!white},enhanced,breakable,before skip=2mm,after skip=2mm,
%%colback=red!5!white,colbacktitle=red!75!black, colframe=red!75!black,boxrule=0.5mm,
%%attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%%varwidth boxed title*=-3cm,
%%boxed title style={frame code={
%%\path[fill=tcbcolback!30!black]
%%([yshift=-1mm,xshift=-1mm]frame.north west)
%%arc[start angle=0,end angle=180,radius=1mm]
%%([yshift=-1mm,xshift=1mm]frame.north east)
%%arc[start angle=180,end angle=0,radius=1mm];
%%\path[left color=tcbcolback!80!black,right color=tcbcolback!80!black,
%%middle color=tcbcolback!90!black]
%%([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%%[rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%%-- (frame.south east) -- (frame.south west)
%%-- ([xshift=-1mm,yshift=-1mm]frame.north west)
%%[sharp corners]-- cycle;
%%},interior engine=empty,
%%},
%%fonttitle=\bfseries,
%%title=Definition of {#2},
%%#1}
%%%title={#2},#1}
%%
%\newtcolorbox{definicion}[2][]{width=\textwidth,lifted shadow={1mm}{-2mm}{3mm}{0.1mm}%
%        {black!50!white},enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=red!5!white,colbacktitle=red!75!black, colframe=red!75!black,boxrule=0.5mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!80!black,right color=tcbcolback!80!black,
%            middle color=tcbcolback!90!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    title=Definición de {#2},
%    #1}
%%title={#2},#1}
%%
%
%\newtcolorbox{definitionlocal}[2][]{width=\textwidth,lifted shadow={1mm}{-2mm}{3mm}{0.1mm}%
%        {black!50!white},enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=red!5!white,colbacktitle=red!75!black, colframe=red!75!black,boxrule=0.5mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!80!black,right color=tcbcolback!80!black,
%            middle color=tcbcolback!90!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    title=Definition of {#2},
%    #1}
%%title={#2},#1}
%%
%
%\newtcolorbox{consejos}[2][]{width=\textwidth,lifted shadow={1mm}{-2mm}{3mm}{0.1mm}%
%        {black!50!white},enhanced,breakable,before skip=2mm,after skip=2mm,
%    colback=yellow!5!white,colbacktitle=yellow!75!black, colframe=yellow!75!black,boxrule=0.5mm,
%    attach boxed title to top left={xshift=1cm,yshift*=1mm-\tcboxedtitleheight},
%    varwidth boxed title*=-3cm,
%    boxed title style={frame code={
%        \path[fill=tcbcolback!30!black]
%        ([yshift=-1mm,xshift=-1mm]frame.north west)
%        arc[start angle=0,end angle=180,radius=1mm]
%        ([yshift=-1mm,xshift=1mm]frame.north east)
%        arc[start angle=180,end angle=0,radius=1mm];
%        \path[left color=tcbcolback!80!black,right color=tcbcolback!80!black,
%            middle color=tcbcolback!90!black]
%        ([xshift=-2mm]frame.north west) -- ([xshift=2mm]frame.north east)
%        [rounded corners=1mm]-- ([xshift=1mm,yshift=-1mm]frame.north east)
%        -- (frame.south east) -- (frame.south west)
%        -- ([xshift=-1mm,yshift=-1mm]frame.north west)
%        [sharp corners]-- cycle;
%    },interior engine=empty,
%    },
%    fonttitle=\bfseries,
%    title=Consejos sobre ejercicios de  {#2},
%    #1}
%%title={#2},#1}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%
%\RequirePackage{xstring}
%% Mis últimos cambios 22/05/2024
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% MIS Comandos FÍSICA Y QUÍMICA
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\newcommand{\kcoulomb}{\dfrac{1}{4\pi\varepsilon_0}}
%
%%\newcommand{\electron}{$e^-$}
%
%\newcommand\elec{\ch{e^-}}
%\newcommand{\electron}{\ce{e-}}
%\newcommand\prot{\ch{p^+}}
%\newcommand\neut{\ch{n^0}}
%
%\newcommand{\carga}[2][c]{
%    \IfEqCase {#1}{
%            {c}{\SI{#2}{\coulomb}\;}
%            {mc}{\SI{#2}{\milli\coulomb}\;}
%            {microc}{\SI{#2}{\micro\coulomb}\;}
%            {nc}{\SI{#2}{\nano\coulomb}\;}
%            {pc}{\SI{#2}{\pico\coulomb}\;}
%    }
%}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Química
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\usepackage{siunitx}
%
%\sisetup{%
%%alsoload = synchem,
%    detect-family,%
%    per-mode = fraction,
%%display-per-mode = fraction,
%%inline-per-mode = symbol,
%%per-mode = symbol-or-fraction,
%    output-decimal-marker = {,},
%    inter-unit-product = \cdot,
%    exponent-product = \cdot,
%    retain-explicit-plus % consigo que si pongo + en el número aparezca
%}
%
%\DeclareSIUnit\cv{CV}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Unidades de Distancia
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\DeclareSIUnit\km{\kilo\metre}
%\DeclareSIUnit\cm{\centi\metre}
%\DeclareSIUnit\kL{\kilo\litre}
%\DeclareSIUnit\mm{\milli\metre}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Unidades de volumen
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\DeclareSIUnit\mL{\milli\litre}
%\DeclareSIUnit\kL{\kilo\litre}
%\DeclareSIUnit\L{\litre}
%\DeclareSIUnit\cmcubicos{\cubic\centi\metre}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Unidades de Masa
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\DeclareSIUnit\kg{\kilo\g}
%\DeclareSIUnit\mg{\milli\g}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Unidades de Masa
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\DeclareSIUnit\moles{moles}
%\DeclareSIUnit\mol{mol}
%\DeclareSIUnit\gmol{\g\per\mol}
%\DeclareSIUnit\uma{uma}
%\DeclareSIUnit\amu{amu}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Unidades de Tiempo
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\DeclareSIUnit\minuto{min}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Unidades de Enltalpía
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\DeclareSIUnit\kjpmol{\kilo\joule\per\mole}
%\DeclareSIUnit\jpmolpk{\joule\per\mole\per\kelvin}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Unidades de Velocidad
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\DeclareSIUnit\mps{\metre\per\s}
%
%\DeclareSIUnit\kmph{\km\per\hour}
%\DeclareSIUnit\kmps{\km\per\s}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Unidades de aceleracion
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\DeclareSIUnit\mpss{\metre\per\square\s}
%\DeclareSIUnit\kmphh{\km\per\square\hour}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Unidades de Fuerza
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\DeclareSIUnit\kilopondio{kp}
%\DeclareSIUnit\dina{din}
%\DeclareSIUnit\atmospher{atm}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Unidades de Energía
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\DeclareSIUnit\kj{\kilo\joule}
%
%\DeclareSIUnit\calorie{cal}
%\DeclareSIUnit\erg{erg}
%\DeclareSIUnit\kwh{kWh}
%\DeclareSIUnit\kilojoule{\kilo\joule}
%\DeclareSIUnit\uma{u}
%%\DeclareSIUnit\mol{mol}
%\DeclareSIUnit\mmhg{mmHg}
%\DeclareSIUnit\kp{kp}
%%! \DeclareSIUnit{\molar}{M} está declarada en el paquete de chemmacros como mol/dm3
%%\DeclareSIUnit\mol{mol}
%\DeclareSIUnit\mmhg{mmHg}
%%\DeclareSIUnit{\molar}{M} está declarado en chemmacros
%\DeclareSIUnit{\M}{M}
%\DeclareSIUnit\gauss{G}
%
%
%\DeclareSIUnit{\molaridad}{M}
%
%\DeclareSIUnit{\kJpmol}{\kilo\joule\per\mol}
%\DeclareSIUnit{\JpKmol}{\joule\per\kelvin\per\mol}
%
%
%
%\newcommand{\velocidad}[2][ms]{
%    \IfEqCase {#1}{
%            {ms}{\SI{#2}{\metre\per\s}\;}
%            {kmh}{\SI{#2}{\kilo\metre\per\s}\;}
%            {kms}{\SI{#2}{\kilo\metre\per\s}\;}
%    }
%}
%
%\newcommand{\distancia}[2][m]{
%    \IfEqCase {#1}{
%            {m}{\SI{#2}{\m}\;}
%            {km}{\SI{#2}{\kilo\m}\;}
%            {cm}{\SI{#2}{\centi\m}\;}
%            {mm}{\SI{#2}{\milli\m}\;}
%            {dm}{\SI{#2}{\deci\m}\;}
%            {nm}{\SI{#2}{\nano\m}\;}
%            {microm}{\SI{#2}{\micro\m}\;}
%    }
%}
%
%\newcommand{\masa}[2][g]{
%    \IfEqCase{#1}{
%            {g}{\SI{#2}{\g}\;}
%            {mg}{\SI{#2}{\milli\g}\;}
%            {kg}{\SI{#2}{\kilo\g}\;}
%    }
%}
%\newcommand{\densidad}[2][gl]{
%    \IfEqCase {#1}{
%            {gl}{\SI{#2}{\g\per\liter}\;}
%            {gml}{\SI{#2}{\g\per\milli\liter}\;}
%    }
%}
%
%\newcommand{\energia}[2][j]{
%    \IfEqCase {#1}{
%            {j}{\SI{#2}{\joule}\;}
%            {kj}{\SI{#2}{\kilo\joule}\;}
%            {kcal}{\SI{#2}{\kilo\calorie}\;}
%            {cal}{\SI{#2}{\calorie}\;}
%            {jmol}{\SI{#2}{\joule\per\mole}\;}
%            {kjmol}{\SI{#2}{\kilo\joule\per\mole}\;}
%            {kcalmol}{\SI{#2}{\kilo\calorie\per\mole}\;}
%            {calmol}{\SI{#2}{\calorie\per\mole}\;}
%            {ev}{\SI{#2}{\electronvolt}\;}
%    }
%}
%
%\newcommand{\temperatura}[2][c]{
%    \IfEqCase {#1}{
%            {c}{\SI{#2}{\celsius}\;}
%            {k}{\SI{#2}{\kelvin}\;}
%    }
%}
%
%
%\newcommand{\volumen}[2][l]{
%    \IfEqCase {#1}{
%            {l}{\SI{#2}{\liter}\;}
%            {ml}{\SI{#2}{\milli\liter}\;}
%            {metroscubicos}{\SI{#2}{\cubic\metre}\;}
%            {decimetroscubicos}{\SI{#2}{\cubic\deci\metre}\;}
%            {centimetroscubicos}{\SI{#2}{\cubic\centi\metre}\;}
%    }
%}
%
%\newcommand{\presion}[2][atm]{
%    \IfEqCase {#1}{
%            {atm}{\SI{#2}{\atmospher}\;}
%            {mmhg}{\SI{#2}{\mmhg}\;}
%    }
%}
%
%\newcommand{\concentracion}[2][molar]{
%    \IfEqCase {#1}{
%            {molar}{\SI{#2}{\mole\per\litre}\;}
%            {m}{\SI{#2}{\M\;}}
%            {gl}{\SI{#2}{\g\per\litre}\;}
%            {mgl}{\SI{#2}{\milli\g\per\litre}\;}
%    }
%}
%
%\newcommand{\resistencia}[2][o]{
%    \IfEqCase {#1}{
%            {o}{\SI{#2}{\ohm\;}}
%            {mo}{\SI{#2}{\milli\ohm}\;}
%    }
%}
%
%\newcommand{\eo}[3]{$\overset{^{\color{#1}#2}}{\text{\ch{#3}}}$}
%\newcommand{\eob}[2]{$\overset{^{\color{blue}#1}}{\text{\ch{#2}}}$}
%\newcommand{\eor}[2]{$\overset{^{\color{red}#1}}{\text{\ch{#2}}}$}
%
%
%\newcommand{\entalpia}[1]{\Delta H_{#1}}
%
%\newcommand{\formula}[1]{\ch{#1}}
%
%\newcommand{\conc}[1]{[\ch{#1}]}
%
%\newcommand{\prima}{^\prime}
%
%\newcommand{\moles}[1]{\SI{#1}{\mole}}
%
%\newcommand{\ctegases}{\SI{0.082}{\atmospher\litre\per\kelvin\per\mole}}
%
%\newcommand{\ph}[1]{\pH = \num{#1}} %? Requiere chemmacros
%\newcommand{\poh}[1]{\pOH = \num{#1}} %? Requiere chemmacros
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Energy and Fources
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\newcommand{\fuerza}[1]{\SI{#1}{\newton}}
%%\newcommand{\energia}[1]{\SI{#1}{\joule}}
%\newcommand{\trabajo}[1]{\SI{#1}{\joule}}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Time
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\newcommand{\segundos}[1]{\SI{#1}{\s}}
%% %%%%%%%%%%%%%%%%%%%%%%%%%%
%% Comandos negrita símbolo
%% %%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\newcommand{\boldsym}[1]{\(\bm{#1}\)}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Commands
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\providecommand{\abs}[1]{\lvert#1\rvert} % para el valor absoluto
%\providecommand{\norm}[1]{\lVert#1\rVert} % la norma de un vector
%
%\newcommand{\ui}{\;\vec{i}\;} % Vector unitario
%\newcommand{\uj}{\;\vec{j}\;} % Vector unitario
%\newcommand{\uk}{\;\vec{k}\;} % Vector unitario
%
%\newcommand{\magnetico}[2][t]{
%    \IfEqCase {#1}{
%            {t}{\SI{#2}{\tesla}\;}
%            {mt}{\SI{#2}{\milli\tesla}\;}
%            {g}{\SI{#2}{\gauss}\;}
%    }
%}
%
%\newcommand{\intensidad}[2][a]{
%    \IfEqCase {#1}{
%            {a}{\SI{#2}{\ampere}\;}
%            {ma}{\SI{#2}{\milli\ampere}\;}
%    }
%}
%
%
%
%\newcommand{\gravitacion}{\SI{6.67e-11}{\newton\square\metre\per\square\kilogram}}
%
%\newcommand{\Ggravitacion}{G = \SI{6.67e-11}{\newton\square\metre\per\square\kilogram}}
%\newcommand{\masatierra}{M_T = \SI{5.97e24}{\kilo\g}}
%\newcommand{\masasol}{M_S = \SI{1.99e30}{\kilo\g}}
%\newcommand{\masaluna}{M_L = \SI{7.35e22}{\kg}}
%\newcommand{\radioluna}{R_L = \SI{1.74e6}{\metre}}
%\newcommand{\distanciaSolTierra}{d_{S-T} = \SI{1.5e11}{\metre}}
%
%\newcommand{\epgravitatoria}{-G\cdot \dfrac{M\cdot m}{r}}
%
%\newcommand{\potencialgravitatorio}{-G\cdot \dfrac{M}{r}}
%
%\newcommand{\aceleracion}[1]{\SI{#1}{\m\per\square\s}}
%
%\newcommand{\ctecoulomb}{K = \SI{9e9}{\newton\square\metre\per\square\coulomb}}
%
%\newcommand{\velocidadangular}[2][rads]{
%    \IfEqCase {#1}{
%            {rads}{\SI{#2}{\radian\per\second}\;}
%    }
%}
%
%\newcommand{\permeabilidad}{$\mu\;=\mu_0\;\mu_r$}
%
%\newcommand{\permeabilidadrelativa}{$\mu_r$}
%
%\newcommand{\permeabilidadvacio}{\mu_0 = 4\pi\cdot 10^{-7}\; \si{\tesla\metre\per\ampere}}
%
%\newcommand{\ctelorentz}{\sqrt{1-\dfrac{v^2}{c^2}}}
%
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%55
%% Comandos referencias
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5%
%
%\newcommand{\rxref}[1]{[\(R\)\ref{#1}]}
%
%\newcommand{\rxrefn}[1]{[\(R\)\textbf{\ref{#1}}]}
%
%
%
%
%\usepackage{color}
%
%\usepackage{xcolor}
%
%\definecolor{greycolour}{HTML}{525252}
%\definecolor{sharelatexcolour}{HTML}{882B21}
%\definecolor{mybluecolour}{HTML}{394773}
%\newcommand{\wordcolour}{greycolour}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Metropolis Theme Beamer colours
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
%\definecolor{mDarkBrown}{HTML}{604c38}
%\definecolor{mDarkTeal}{HTML}{23373b}
%\definecolor{mLightBrown}{HTML}{EB811B}
%\definecolor{mLightGreen}{HTML}{14B03D}
%
%
%
%\colorlet{mygreen}{green!50!black}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% Colors
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%\definecolor{blue254}{HTML}{25289E}
%\definecolor{orange22}{HTML}{E55500}
%\definecolor{myBlue}{HTML}{027FDF}
%\definecolor{negative}{HTML}{181818}
%\definecolor{positive}{HTML}{AA3939}
%
%% Colores rgb
%\definecolor{signBlue}{rgb}{0, .25, .53}
%\definecolor{emeraldGreen}{rgb}{0, .79, .34}
%\definecolor{topaz}{rgb}{0, .6, .88}
%\definecolor{indigoDye}{rgb}{.05, .31, .55}
%\definecolor{indigo2}{rgb}{.13, .53, .41}
%\definecolor{blueSpider}{rgb}{.15, .27, .43}
%\definecolor{darkOliveGreen2}{rgb}{.74, .93, .41}
%\definecolor{ochre}{rgb}{.8, .47, .13}
%\definecolor{darkOrange}{rgb}{.8, .4, .0}
%\definecolor{myOrange3}{RGB}{221,58,18}% Naranja VIU
%\definecolor{skyblue6}{rgb}{.2, .6, .8}
%\definecolor{firebrick}{rgb}{.7, .13, .13}
%\definecolor{blueice}{rgb}{.85, .96, .94}
%\definecolor{lightcopper}{rgb}{.93, .76, .58}
%\definecolor{azulF}{rgb}{.0,.0,.3}
%\definecolor{ocreclaro}{rgb}{1,0.85,0.6} % puedes ajustar luego a tu gusto
%
%% Colores HTML
%\definecolor{structColor}{HTML}{201090} % 015793
%\definecolor{barColor}{HTML}{202122} % 202122
%\definecolor{backColor}{HTML}{8998B5} % 8998B5
%\definecolor{titlesColor}{HTML}{008100} % FF6614
%\definecolor{myBlue2}{HTML}{027FDF}
%\definecolor{myBlue3}{HTML}{0015C2}
%\definecolor{myGray}{HTML}{181818}
%\definecolor{myRed}{HTML}{AA3939}
%\definecolor{myGreen}{HTML}{32AB77}
%\definecolor{myOrange}{HTML}{FF6302}
%\definecolor{myOrange2}{HTML}{F14610}
%\definecolor{myOrange3}{HTML}{DD3A12}
%\definecolor{borgoña}{HTML}{800000}
%\definecolor{granate}{HTML}{AB2A3E}
%\definecolor{darkblue}{HTML}{000070}
%
%\definecolor{greycolour}{HTML}{525252}
%\definecolor{sharelatexcolour}{HTML}{882B21}
%\definecolor{mybluecolour}{HTML}{394773}