# Text to Embroidery Converter

This module provides functionality to convert text into embroidery machine files that can be used with various embroidery machines.

## 🚀 Features

- **Text Input**: Convert any text string to embroidery files
- **Multiple Shapes**: Support for straight line and circular text layouts
- **Multiple Formats**: Generate files in DST, PES, JEF, EXP, VP3, and HUS formats
- **Unit Support**: Work with millimeters or inches
- **Customizable Dimensions**: Set line length or circle radius
- **Offline Processing**: Works completely offline in Docker containers

## 📁 Files

- `text_embroidery.py` - Main conversion module
- `test_text_embroidery.py` - Test script to verify functionality
- `main.py` - FastAPI worker service with text-to-embroidery endpoints

## 🔧 Usage

### Basic Text Conversion

```python
from text_embroidery import TextEmbroideryConverter, TextEmbroideryRequest

# Initialize converter
converter = TextEmbroideryConverter()

# Create request
request = TextEmbroideryRequest(
    text="HELLO WORLD",
    shape="line",
    units="mm",
    line_length=150,
    output_formats=["DST", "PES", "JEF"]
)

# Convert to embroidery files
files = converter.convert_text_to_embroidery(request)

# Access results
for file in files:
    print(f"Format: {file.format}")
    print(f"Filename: {file.filename}")
    print(f"Content size: {len(file.content)} bytes")
```

### Circular Text Layout

```python
request = TextEmbroideryRequest(
    text="CIRCULAR TEXT",
    shape="circle",
    units="mm",
    circle_radius=60,
    output_formats=["DST", "PES"]
)
```

## 🌐 API Endpoints

### POST `/text-to-embroidery`

Convert text to embroidery files.

**Request Body:**
```json
{
  "text": "HELLO WORLD",
  "shape": "line",
  "units": "mm",
  "line_length": 150,
  "output_formats": ["DST", "PES", "JEF"]
}
```

**Response:**
```json
{
  "success": true,
  "text": "HELLO WORLD",
  "shape": "line",
  "units": "mm",
  "files": [
    {
      "format": "DST",
      "content": "base64_encoded_content",
      "filename": "embroidery_HELLO WORLD_dst.dst",
      "size": 1024
    }
  ],
  "message": "Successfully generated 1 embroidery file(s) from text 'HELLO WORLD'"
}
```

### GET `/text-embroidery-formats`

Get list of supported embroidery formats.

**Response:**
```json
{
  "supported_formats": ["DST", "PES", "JEF", "EXP", "VP3", "HUS"],
  "description": "Supported embroidery machine file formats"
}
```

## 🐳 Docker Testing

### 1. Build and Start Services

```bash
docker-compose up --build
```

### 2. Test the Worker Service

```bash
# Test text-to-embroidery endpoint
curl -X POST "http://localhost:8001/text-to-embroidery" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "TEST",
    "shape": "line",
    "units": "mm",
    "line_length": 100,
    "output_formats": ["DST", "PES"]
  }'
```

### 3. Run Python Tests

```bash
# Enter the worker container
docker-compose exec worker bash

# Run tests
python test_text_embroidery.py
```

## 📊 Supported Formats

| Format | Description | Machine Compatibility |
|--------|-------------|----------------------|
| DST    | Tajima format | Tajima, Brother, most machines |
| PES    | Brother format | Brother, Babylock, some others |
| JEF    | Janome format | Janome machines |
| EXP    | Melco format | Melco, Bernina machines |
| VP3    | Pfaff format | Pfaff machines |
| HUS    | Husqvarna format | Husqvarna machines |

## ⚙️ Configuration

### Environment Variables

- `WORKER_API_KEY` - API key for worker service authentication
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string

### Text Parameters

- **Character Width**: Default 6mm per character (configurable)
- **Stitch Density**: Default 0.4 stitches per mm (configurable)
- **Line Height**: Fixed at 20mm for line text
- **Circle Layout**: Automatically calculates character spacing

## 🔍 Testing

### Run Test Script

```bash
cd worker
python test_text_embroidery.py
```

### Test Cases

1. **Simple Line Text**: Basic horizontal text layout
2. **Circular Text**: Text arranged in a circle
3. **Long Text Line**: Extended text with custom line length
4. **Format Generation**: Individual format testing

## 🚨 Error Handling

The converter includes comprehensive error handling:

- **Input Validation**: Checks for required fields and valid values
- **Format Support**: Gracefully handles unsupported formats
- **Processing Errors**: Logs errors and continues with other formats
- **API Errors**: Returns proper HTTP status codes and error messages

## 🔮 Future Enhancements

- **Font Selection**: Multiple font styles and weights
- **Advanced Layouts**: Arc, wave, and custom path text
- **Color Support**: Multi-color embroidery files
- **Stitch Optimization**: Improved stitch density and quality
- **Real-time Preview**: Visual preview of generated designs

## 📝 Notes

- **Mock Implementation**: Current version generates mock files for testing
- **Production Ready**: Can be extended with real embroidery libraries
- **Offline Capable**: Works without internet connection
- **Scalable**: Designed for high-volume processing

## 🤝 Contributing

To extend the text-to-embroidery functionality:

1. Add new format support in `TextEmbroideryConverter`
2. Implement real embroidery file generation
3. Add new layout options
4. Enhance stitch generation algorithms
5. Add comprehensive testing

## 📚 Resources

- [Embroidery File Formats](https://en.wikipedia.org/wiki/Embroidery_file_formats)
- [Ink/Stitch Documentation](https://inkstitch.org/)
- [libembroidery Library](https://github.com/EmbroidePy/libembroidery)
