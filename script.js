<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Random Wikipedia Overlay Grid</title>
    <style>
        body {
            background-color: #222;
            margin: 0;
            padding: 20px;
            text-align: center;
            font-family: Arial, sans-serif;
        }

        #grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }

        .image-container {
            position: relative;
            width: 100%;
            padding-top: 75%; /* Maintain aspect ratio */
            overflow: hidden;
            border: 2px solid #fff;
            border-radius: 8px;
        }

        .image-container img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .overlay {
            position: absolute;
            cursor: grab;
        }
    </style>
</head>
<body>
    <div id="grid"></div>
    <script src="script.js"></script>
</body>
</h

